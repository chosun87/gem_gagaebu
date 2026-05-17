import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import {
  fetchSheetData,
  batchUpdateSheetValues,
  appendSheetRow,
  updateSheetRow,
  markSheetRowDeleted,
} from '@/api/sheetApi'
import { useAuth } from '@/context/AuthContext'
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants'

const AssetContext = createContext(null)

export const AssetProvider = ({ children }) => {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sheet자산Data, setSheet자산Data] = useState([])

  const loadSheet자산Data = useCallback(async () => {
    setLoading(true)
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.ASSET)
      const parsedData = []

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i]
        if (!row || row.length < 2) continue

        const getVal = (idx) =>
          row[idx] !== undefined ? String(row[idx]).trim() : ''

        const deletedVal = getVal(SHEET_COL_INDEX.ASSET.accDeleted)
        const isDeleted =
          deletedVal !== '' && deletedVal.toUpperCase() !== 'FALSE'

        if (isDeleted) continue

        parsedData.push({
          sheetName: '자산',
          sheetRowNo: i + 1,
          accType: getVal(SHEET_COL_INDEX.ASSET.accType),
          accCode: getVal(SHEET_COL_INDEX.ASSET.accCode),
          accLabel: getVal(SHEET_COL_INDEX.ASSET.accLabel),
          accIcon: getVal(SHEET_COL_INDEX.ASSET.accIcon),
          accDefault:
            getVal(SHEET_COL_INDEX.ASSET.accDefault).toUpperCase() === 'TRUE',
          accOrder: Number(row[SHEET_COL_INDEX.ASSET.accOrder]) || 0,
          accMemo: getVal(SHEET_COL_INDEX.ASSET.accMemo),
          accDeleted: isDeleted,
          accTimestamp: getVal(SHEET_COL_INDEX.ASSET.accTimestamp),
          accUnused:
            getVal(SHEET_COL_INDEX.ASSET.accUnused).toUpperCase() === 'TRUE',
        })
      }

      setSheet자산Data(parsedData)
    } catch (error) {
      console.error('Asset data loading error', error)
      setSheet자산Data([])
    } finally {
      setLoading(false)
    }
  }, [])

  // 자산 추가 및 수정
  const saveAssetEntry = useCallback(async (entry) => {
    setLoading(true)
    try {
      const isNew = !entry.sheetRowNo
      const timestamp = new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19)

      const rowValues = []
      rowValues[SHEET_COL_INDEX.ASSET.accType] = entry.accType || ''
      rowValues[SHEET_COL_INDEX.ASSET.accCode] = entry.accCode || ''
      rowValues[SHEET_COL_INDEX.ASSET.accLabel] = entry.accLabel || ''
      rowValues[SHEET_COL_INDEX.ASSET.accIcon] = entry.accIcon || ''
      rowValues[SHEET_COL_INDEX.ASSET.accDefault] = entry.accDefault
        ? 'TRUE'
        : 'FALSE'
      rowValues[SHEET_COL_INDEX.ASSET.accOrder] = entry.accOrder || 0
      rowValues[SHEET_COL_INDEX.ASSET.accMemo] = entry.accMemo || ''
      rowValues[SHEET_COL_INDEX.ASSET.accUnused] = entry.accUnused
        ? 'TRUE'
        : 'FALSE'
      rowValues[SHEET_COL_INDEX.ASSET.accDeleted] = '' // 삭제 취소 또는 정상 상태
      rowValues[SHEET_COL_INDEX.ASSET.accTimestamp] = timestamp

      let newRowNo = entry.sheetRowNo

      if (isNew) {
        // 새 자산 등록
        const res = await appendSheetRow('자산', rowValues)
        if (res && res.updates && res.updates.updatedRange) {
          const match = res.updates.updatedRange.split(':')[0].match(/\d+$/)
          if (match) newRowNo = parseInt(match[0], 10)
        }
      } else {
        // 기존 자산 수정
        await updateSheetRow('자산', newRowNo, rowValues)
      }

      const updatedEntry = {
        ...entry,
        sheetName: '자산',
        sheetRowNo: newRowNo,
        accTimestamp: timestamp,
      }

      // Optimistic UI Update
      setSheet자산Data((prev) => {
        if (isNew) {
          return [...prev, updatedEntry]
        } else {
          return prev.map((item) =>
            item.sheetRowNo === newRowNo ? { ...item, ...updatedEntry } : item,
          )
        }
      })

      return true
    } catch (error) {
      console.error('Error saving asset entry:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // 자산 삭제 (Soft Delete)
  const deleteAssetEntry = useCallback(async (entry) => {
    if (!entry || !entry.sheetRowNo) return false
    setLoading(true)
    try {
      // Optimistic UI Update
      setSheet자산Data((prev) =>
        prev.filter((item) => item.sheetRowNo !== entry.sheetRowNo),
      )

      await markSheetRowDeleted(
        '자산',
        entry.sheetRowNo,
        SHEET_COL_INDEX.ASSET.accDeleted,
      )

      return true
    } catch (error) {
      console.error('Error deleting asset entry:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const saveAssetOrder = useCallback(async (reorderedData) => {
    setLoading(true)
    try {
      const dataArray = reorderedData.map((item, index) => ({
        range: `자산!F${item.sheetRowNo}`, // accOrder 컬럼은 F(인덱스 5)
        values: [[index + 1]], // 1부터 시작하는 순서 부여
      }))

      await batchUpdateSheetValues(dataArray)

      // 로컬 상태 업데이트 (불변성 유지)
      setSheet자산Data((prev) => {
        return prev.map((item) => {
          const found = reorderedData.find((r) => r.accCode === item.accCode)
          if (found) {
            const newIdx = reorderedData.findIndex(
              (r) => r.accCode === item.accCode,
            )
            return { ...item, accOrder: newIdx + 1 }
          }
          return item
        })
      })

      return true
    } catch (error) {
      console.error('Error saving asset order:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const assetNodes = useMemo(() => {
    const groups = {}

    const sortedData = [...sheet자산Data].sort((a, b) => {
      if (a.accType < b.accType) return -1
      if (a.accType > b.accType) return 1
      return a.accOrder - b.accOrder
    })

    sortedData.forEach((item) => {
      if (!groups[item.accType]) {
        groups[item.accType] = {
          accType: item.accType,
          selectable: false,
          children: [],
        }
      }
      groups[item.accType].children.push({
        accCode: item.accCode,
        accLabel: item.accLabel,
        accIcon: item.accIcon || 'pi pi-fw pi-wallet',
        accDefault: item.accDefault,
        accOrder: item.accOrder,
        accMemo: item.accMemo,
      })
    })

    return Object.values(groups)
  }, [sheet자산Data])

  const defaultAssetCode = useMemo(() => {
    const defaultItem = sheet자산Data.find((item) => item.accDefault)
    return defaultItem ? defaultItem.accCode : ''
  }, [sheet자산Data])

  const contextValue = useMemo(
    () => ({
      sheet자산Data,
      assetNodes,
      defaultAssetCode,
      loading,
      loadSheet자산Data,
      saveAssetEntry,
      deleteAssetEntry,
      saveAssetOrder,
    }),
    [
      sheet자산Data,
      assetNodes,
      defaultAssetCode,
      loading,
      loadSheet자산Data,
      saveAssetEntry,
      deleteAssetEntry,
      saveAssetOrder,
    ],
  )

  useEffect(() => {
    if (isSignedIn) {
      loadSheet자산Data()
    }
  }, [isSignedIn, loadSheet자산Data])

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <AssetContext.Provider value={contextValue}>
      {children}
    </AssetContext.Provider>
  )
}

export const useAssetData = () => useContext(AssetContext)
