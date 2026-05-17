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
  updateSheetCell,
  appendSheetRow,
  updateSheetRow,
  markSheetRowDeleted,
} from '@/api/sheetApi'
import { useAuth } from '@/context/AuthContext'
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants'
import { parseAmount } from '@/assets/js/dataUtils'
import dayjs from 'dayjs'

const RepeatContext = createContext(null)

export const RepeatProvider = ({ children }) => {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sheet반복Data, setSheet반복Data] = useState([])

  const loadSheet반복Data = useCallback(async () => {
    setLoading(true)
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.REPEAT)
      const parsedData = []

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i]
        if (!row || row.length < 2) continue

        const getVal = (idx) =>
          row[idx] !== undefined ? String(row[idx]).trim() : ''

        // 삭제 여부 체크
        const deletedVal = getVal(SHEET_COL_INDEX.REPEAT.rpDeleted)
        const isDeleted =
          deletedVal !== '' && deletedVal.toUpperCase() !== 'FALSE'

        if (isDeleted) continue

        parsedData.push({
          sheetName: '반복',
          sheetRowNo: i + 1,
          rpID: getVal(SHEET_COL_INDEX.REPEAT.rpID),
          rpDateS: getVal(SHEET_COL_INDEX.REPEAT.rpDateS),
          rpDateE: getVal(SHEET_COL_INDEX.REPEAT.rpDateE),
          rpPeriod: getVal(SHEET_COL_INDEX.REPEAT.rpPeriod),
          rpDay: getVal(SHEET_COL_INDEX.REPEAT.rpDay),
          rpCompleted:
            getVal(SHEET_COL_INDEX.REPEAT.rpCompleted).toUpperCase() === 'TRUE',
          rpType: getVal(SHEET_COL_INDEX.REPEAT.rpType),
          rpAcc1: getVal(SHEET_COL_INDEX.REPEAT.rpAcc1),
          rpAcc2: getVal(SHEET_COL_INDEX.REPEAT.rpAcc2),
          rpCategory: getVal(SHEET_COL_INDEX.REPEAT.rpCategory),
          rpAmount: parseAmount(getVal(SHEET_COL_INDEX.REPEAT.rpAmount)),
          rpTotalAmount: parseAmount(
            getVal(SHEET_COL_INDEX.REPEAT.rpTotalAmount),
          ),
          rpMemo: getVal(SHEET_COL_INDEX.REPEAT.rpMemo),
          rpDeleted: isDeleted,
          rpTimestamp: getVal(SHEET_COL_INDEX.REPEAT.rpTimestamp),
        })
      }

      setSheet반복Data(parsedData.reverse())
    } catch (error) {
      console.error('Repeat data loading error', error)
      setSheet반복Data([])
    } finally {
      setLoading(false)
    }
  }, [])

  const saveRepeatEntry = useCallback(async (repeat, formData) => {
    setLoading(true)
    try {
      const rpID = repeat ? repeat.rpID : Date.now().toString()

      // 저장할 객체를 먼저 구성한 뒤, 시트용 배열로 변환
      const newObj = {
        sheetName: '반복',
        sheetRowNo: repeat ? repeat.sheetRowNo : 0,
        rpID,
        rpDateS: formData.rpDateS
          ? dayjs(formData.rpDateS).format('YYYY-MM-DD')
          : '',
        rpDateE: formData.rpDateE
          ? dayjs(formData.rpDateE).format('YYYY-MM-DD')
          : '',
        rpPeriod: formData.rpPeriod || 'M',
        rpDay: formData.rpDay || '1',
        rpCompleted: formData.rpCompleted ?? false,
        rpType: formData.rpType || '',
        rpAcc1: formData.rpAcc1 || '',
        rpAcc2: formData.rpAcc2 || '',
        rpCategory: formData.rpCategory || '',
        rpAmount: formData.rpAmount || 0,
        rpTotalAmount: formData.rpTotalAmount || 0,
        rpMemo: formData.rpMemo || '',
        rpDeleted: false,
        rpTimestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }

      const rowValues = []
      rowValues[SHEET_COL_INDEX.REPEAT.rpID] = newObj.rpID
      rowValues[SHEET_COL_INDEX.REPEAT.rpDateS] = newObj.rpDateS
      rowValues[SHEET_COL_INDEX.REPEAT.rpDateE] = newObj.rpDateE
      rowValues[SHEET_COL_INDEX.REPEAT.rpPeriod] = newObj.rpPeriod
      rowValues[SHEET_COL_INDEX.REPEAT.rpDay] = newObj.rpDay
      rowValues[SHEET_COL_INDEX.REPEAT.rpCompleted] = newObj.rpCompleted
      rowValues[SHEET_COL_INDEX.REPEAT.rpType] = newObj.rpType
      rowValues[SHEET_COL_INDEX.REPEAT.rpAcc1] = newObj.rpAcc1
      rowValues[SHEET_COL_INDEX.REPEAT.rpAcc2] = newObj.rpAcc2
      rowValues[SHEET_COL_INDEX.REPEAT.rpCategory] = newObj.rpCategory
      rowValues[SHEET_COL_INDEX.REPEAT.rpAmount] = newObj.rpAmount
      rowValues[SHEET_COL_INDEX.REPEAT.rpTotalAmount] = newObj.rpTotalAmount
      rowValues[SHEET_COL_INDEX.REPEAT.rpMemo] = newObj.rpMemo
      rowValues[SHEET_COL_INDEX.REPEAT.rpDeleted] = ''
      rowValues[SHEET_COL_INDEX.REPEAT.rpTimestamp] = newObj.rpTimestamp

      if (!repeat) {
        const res = await appendSheetRow('반복', rowValues)
        if (res && res.updates && res.updates.updatedRange) {
          const match = res.updates.updatedRange.split(':')[0].match(/\d+$/)
          if (match) newObj.sheetRowNo = parseInt(match[0], 10)
        }

        // Optimistic UI Update (추가)
        setSheet반복Data((prev) => [newObj, ...prev])
      } else {
        await updateSheetRow('반복', repeat.sheetRowNo, rowValues)

        // Optimistic UI Update (수정)
        setSheet반복Data((prev) =>
          prev.map((item) =>
            item.sheetRowNo === repeat.sheetRowNo
              ? { ...item, ...newObj }
              : item,
          ),
        )
      }

      return rpID
    } catch (error) {
      console.error('Error saving repeat entry:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRepeatEntry = useCallback(async (repeat) => {
    if (!repeat) return
    setLoading(true)
    try {
      // Optimistic UI Update (삭제)
      setSheet반복Data((prev) =>
        prev.filter((item) => item.sheetRowNo !== repeat.sheetRowNo),
      )

      await markSheetRowDeleted(
        '반복',
        repeat.sheetRowNo,
        SHEET_COL_INDEX.REPEAT.rpDeleted,
      )

      return true
    } catch (error) {
      console.error('Error deleting repeat entry:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRepeatEntry_rpCompleted = useCallback(
    async (rowData, newValue) => {
      setSheet반복Data((prevData) =>
        prevData.map((item) =>
          item.sheetRowNo === rowData.sheetRowNo
            ? { ...item, rpCompleted: newValue }
            : item,
        ),
      )

      try {
        const sheetColName = String.fromCharCode(
          'A'.charCodeAt(0) + SHEET_COL_INDEX.REPEAT.rpCompleted,
        )
        await updateSheetCell(
          `반복!${sheetColName}${rowData.sheetRowNo}`,
          newValue,
        )
      } catch {
        setSheet반복Data((prevData) =>
          prevData.map((item) =>
            item.sheetRowNo === rowData.sheetRowNo
              ? { ...item, rpCompleted: !newValue }
              : item,
          ),
        )
      }
    },
    [],
  )

  const contextValue = useMemo(
    () => ({
      sheet반복Data,
      loading,
      loadSheet반복Data,
      updateRepeatEntry_rpCompleted,
      saveRepeatEntry,
      deleteRepeatEntry,
    }),
    [
      sheet반복Data,
      loading,
      loadSheet반복Data,
      updateRepeatEntry_rpCompleted,
      saveRepeatEntry,
      deleteRepeatEntry,
    ],
  )

  useEffect(() => {
    if (isSignedIn) {
      loadSheet반복Data()
    }
  }, [isSignedIn, loadSheet반복Data])

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <RepeatContext.Provider value={contextValue}>
      {children}
    </RepeatContext.Provider>
  )
}

export const useRepeatData = () => useContext(RepeatContext)
