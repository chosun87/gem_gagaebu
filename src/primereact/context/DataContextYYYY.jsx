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
  appendSheetRows,
  updateSheetRow,
  createSheet,
  updateSheetHeaders,
  markSheetRowDeleted,
} from '@/api/sheetApi'
import { useAuth } from '@/context/AuthContext'
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants'
import { parseAmount, calculateRepeatDates } from '@/assets/js/dataUtils'
import dayjs from 'dayjs'

const YYYYContext = createContext(null)

export const YYYYProvider = ({ children }) => {
  const { isSignedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sheetYYYYData, setSheetYYYYData] = useState({})
  const [loadedSheetYYYY, setLoadedSheetYYYY] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())

  const selectedYear = selectedDate.getFullYear().toString()

  const loadSheet연도Data = useCallback(async (targetYear) => {
    setLoading(true)
    try {
      const rawData = await fetchSheetData(
        SHEET_NAME_RANGE.YEAR.replace('YYYY', targetYear),
      )
      const parsedData = []

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i]
        if (!row || row.length < 2) continue

        const getVal = (idx) =>
          row[idx] !== undefined ? String(row[idx]).trim() : ''

        // 삭제 여부 체크
        const deletedVal = getVal(SHEET_COL_INDEX.YYYY.gDeleted)
        const isDeleted =
          deletedVal !== '' && deletedVal.toUpperCase() !== 'FALSE'

        if (isDeleted) continue

        parsedData.push({
          sheetName: targetYear,
          sheetRowNo: i + 1,
          gDate: getVal(SHEET_COL_INDEX.YYYY.gDate),
          gType: getVal(SHEET_COL_INDEX.YYYY.gType),
          gAcc1: getVal(SHEET_COL_INDEX.YYYY.gAcc1),
          gAcc2: getVal(SHEET_COL_INDEX.YYYY.gAcc2),
          gCategory: getVal(SHEET_COL_INDEX.YYYY.gCategory),
          gAmount: parseAmount(getVal(SHEET_COL_INDEX.YYYY.gAmount)),
          gMemo: getVal(SHEET_COL_INDEX.YYYY.gMemo),
          gExecuted:
            getVal(SHEET_COL_INDEX.YYYY.gExecuted).toUpperCase() === 'TRUE',
          g_rpID: getVal(SHEET_COL_INDEX.YYYY.g_rpID),
          gTimestamp: getVal(SHEET_COL_INDEX.YYYY.gTimestamp),
        })
      }

      const sortedData = parsedData.sort((a, b) => {
        const diff = dayjs(b.gDate).unix() - dayjs(a.gDate).unix()
        if (diff !== 0) return diff
        return b.sheetRowNo - a.sheetRowNo
      })
      setSheetYYYYData((prev) => ({ ...prev, [targetYear]: sortedData }))
      setLoadedSheetYYYY((prev) => ({ ...prev, [targetYear]: true }))
    } catch (error) {
      console.error('Yearly data loading error', error)
      setSheetYYYYData((prev) => ({ ...prev, [targetYear]: [] }))
      setLoadedSheetYYYY((prev) => ({ ...prev, [targetYear]: true }))
    } finally {
      setLoading(false)
    }
  }, [])

  const updateLedgerEntry_gExecute = useCallback(async (rowData, newValue) => {
    const YYYY = rowData.sheetName

    setSheetYYYYData((prev) => ({
      ...prev,
      [YYYY]: (prev[YYYY] || []).map((item) =>
        item.sheetRowNo === rowData.sheetRowNo
          ? { ...item, gExecuted: newValue }
          : item,
      ),
    }))

    try {
      const sheetColName = String.fromCharCode(
        'A'.charCodeAt(0) + SHEET_COL_INDEX.YYYY.gExecuted,
      )
      await updateSheetCell(
        `${rowData.sheetName}!${sheetColName}${rowData.sheetRowNo}`,
        newValue,
      )
    } catch {
      setSheetYYYYData((prev) => ({
        ...prev,
        [YYYY]: (prev[YYYY] || []).map((item) =>
          item.sheetRowNo === rowData.sheetRowNo
            ? { ...item, gExecuted: !newValue }
            : item,
        ),
      }))
    }
  }, [])

  const ensureSheetExists = useCallback(async (sheetName) => {
    try {
      const data = await fetchSheetData(`${sheetName}!A1:A1`)
      if (!data || data.length === 0) {
        const headers = Object.keys(SHEET_COL_INDEX.YYYY).sort(
          (a, b) => SHEET_COL_INDEX.YYYY[a] - SHEET_COL_INDEX.YYYY[b],
        )
        await updateSheetHeaders(sheetName, headers)
      }
    } catch {
      await createSheet(sheetName)
      const headers = Object.keys(SHEET_COL_INDEX.YYYY).sort(
        (a, b) => SHEET_COL_INDEX.YYYY[a] - SHEET_COL_INDEX.YYYY[b],
      )
      await updateSheetHeaders(sheetName, headers)
    }
  }, [])

  const saveLedgerEntry = useCallback(
    async (ledger, formData) => {
      setLoading(true)
      try {
        const gDate = dayjs(formData.gDate)
        const newYear = gDate.format('YYYY')

        // 저장할 객체를 먼저 구성한 뒤, 시트용 배열로 변환
        const newObj = {
          sheetName: newYear,
          sheetRowNo: ledger ? ledger.sheetRowNo : 0,
          gDate: gDate.format('YYYY-MM-DD'),
          gType: formData.gType || '',
          gAcc1: formData.gAcc1 || '',
          gAcc2: formData.gAcc2 || '',
          gCategory: formData.gCategory || '',
          gAmount: formData.gAmount || 0,
          gMemo: formData.gMemo || '',
          gExecuted: formData.gExecuted ?? false,
          g_rpID: formData.g_rpID || '',
          gTimestamp: Date.now(),
        }

        const rowValues = []
        rowValues[SHEET_COL_INDEX.YYYY.gDate] = newObj.gDate
        rowValues[SHEET_COL_INDEX.YYYY.gType] = newObj.gType
        rowValues[SHEET_COL_INDEX.YYYY.gAcc1] = newObj.gAcc1
        rowValues[SHEET_COL_INDEX.YYYY.gAcc2] = newObj.gAcc2
        rowValues[SHEET_COL_INDEX.YYYY.gCategory] = newObj.gCategory
        rowValues[SHEET_COL_INDEX.YYYY.gAmount] = newObj.gAmount
        rowValues[SHEET_COL_INDEX.YYYY.gMemo] = newObj.gMemo
        rowValues[SHEET_COL_INDEX.YYYY.gExecuted] = newObj.gExecuted
        rowValues[SHEET_COL_INDEX.YYYY.g_rpID] = newObj.g_rpID
        rowValues[SHEET_COL_INDEX.YYYY.gDeleted] = ''
        rowValues[SHEET_COL_INDEX.YYYY.gTimestamp] = newObj.gTimestamp

        if (!ledger) {
          await ensureSheetExists(newYear)
          const res = await appendSheetRow(newYear, rowValues)
          if (res && res.updates && res.updates.updatedRange) {
            const match = res.updates.updatedRange.split(':')[0].match(/\d+$/)
            if (match) newObj.sheetRowNo = parseInt(match[0], 10)
          }

          // Optimistic UI Update (추가)
          setSheetYYYYData((prev) => ({
            ...prev,
            [newYear]: [newObj, ...(prev[newYear] || [])].sort(
              (a, b) => dayjs(b.gDate).unix() - dayjs(a.gDate).unix(),
            ),
          }))
        } else {
          if (ledger.sheetName === newYear) {
            await updateSheetRow(newYear, ledger.sheetRowNo, rowValues)

            // Optimistic UI Update (수정)
            setSheetYYYYData((prev) => ({
              ...prev,
              [newYear]: (prev[newYear] || [])
                .map((item) =>
                  item.sheetRowNo === ledger.sheetRowNo
                    ? { ...item, ...newObj }
                    : item,
                )
                .sort((a, b) => dayjs(b.gDate).unix() - dayjs(a.gDate).unix()),
            }))
          } else {
            // 연도가 변경된 경우: 기존 연도에서 삭제 마킹 후 새 연도에 추가
            await markSheetRowDeleted(
              ledger.sheetName,
              ledger.sheetRowNo,
              SHEET_COL_INDEX.YYYY.gDeleted,
            )

            await ensureSheetExists(newYear)
            const res = await appendSheetRow(newYear, rowValues)
            if (res && res.updates && res.updates.updatedRange) {
              const match = res.updates.updatedRange.split(':')[0].match(/\d+$/)
              if (match) newObj.sheetRowNo = parseInt(match[0], 10)
            }

            // Optimistic UI Update (이동)
            setSheetYYYYData((prev) => ({
              ...prev,
              [ledger.sheetName]: (prev[ledger.sheetName] || []).filter(
                (item) => item.sheetRowNo !== ledger.sheetRowNo,
              ),
              [newYear]: [newObj, ...(prev[newYear] || [])].sort(
                (a, b) => dayjs(b.gDate).unix() - dayjs(a.gDate).unix(),
              ),
            }))
          }
        }

        return true
      } finally {
        setLoading(false)
      }
    },
    [ensureSheetExists],
  )

  const deleteLedgerEntry = useCallback(async (ledger) => {
    if (!ledger) return
    setLoading(true)
    try {
      // Optimistic UI Update (삭제)
      setSheetYYYYData((prev) => ({
        ...prev,
        [ledger.sheetName]: (prev[ledger.sheetName] || []).filter(
          (item) => item.sheetRowNo !== ledger.sheetRowNo,
        ),
      }))

      await markSheetRowDeleted(
        ledger.sheetName,
        ledger.sheetRowNo,
        SHEET_COL_INDEX.YYYY.gDeleted,
      )

      return true
    } catch (error) {
      console.error('Error deleting ledger entry:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const generateLedgerFromRepeat = useCallback(
    async (repeat, rpID) => {
      setLoading(true)
      let addedCount = 0
      let updatedCount = 0
      let deletedCount = 0
      try {
        const { rpType, rpAcc1, rpAcc2, rpCategory, rpAmount, rpMemo } = repeat
        const targetDates = calculateRepeatDates(repeat)
        if (targetDates.length === 0)
          return { addedCount: 0, updatedCount: 0, deletedCount: 0 }

        const today = dayjs().startOf('day')
        const targetDateStrings = targetDates.map((d) => d.format('YYYY-MM-DD'))

        // 연도별로 분류하여 처리
        const datesByYear = {}
        targetDates.forEach((date) => {
          const year = date.format('YYYY')
          if (!datesByYear[year]) datesByYear[year] = []
          datesByYear[year].push(date)
        })

        // 모든 로드된 연도 + target 연도들을 대상으로 기간 밖 데이터 체크
        const yearsToCheck = new Set([
          ...Object.keys(sheetYYYYData),
          ...Object.keys(datesByYear),
        ])

        for (const year of yearsToCheck) {
          let existingEntries = sheetYYYYData[year] || []

          if (!loadedSheetYYYY[year]) {
            try {
              const rawData = await fetchSheetData(
                SHEET_NAME_RANGE.YEAR.replace('YYYY', year),
              )
              existingEntries = []
              for (let i = 1; i < rawData.length; i++) {
                const row = rawData[i]
                if (!row || row.length < 2) continue

                const getVal = (idx) =>
                  row[idx] !== undefined ? String(row[idx]).trim() : ''

                const deletedVal = getVal(SHEET_COL_INDEX.YYYY.gDeleted)
                const isDeleted =
                  deletedVal !== '' && deletedVal.toUpperCase() !== 'FALSE'
                if (isDeleted) continue

                existingEntries.push({
                  sheetRowNo: i + 1,
                  gDate: getVal(SHEET_COL_INDEX.YYYY.gDate),
                  gExecuted:
                    getVal(SHEET_COL_INDEX.YYYY.gExecuted).toUpperCase() ===
                    'TRUE',
                  g_rpID: getVal(SHEET_COL_INDEX.YYYY.g_rpID),
                })
              }
            } catch {
              existingEntries = []
            }
          }

          const newRows = []
          let hasChanges = false

          // 1. 기간 내 내역 처리 (신규 생성 또는 업데이트)
          if (datesByYear[year]) {
            for (const date of datesByYear[year]) {
              const dateStr = date.format('YYYY-MM-DD')
              const match = existingEntries.find(
                (entry) => entry.gDate === dateStr && entry.g_rpID === rpID,
              )

              const rowValues = []
              rowValues[SHEET_COL_INDEX.YYYY.gDate] = dateStr
              rowValues[SHEET_COL_INDEX.YYYY.gType] = rpType
              rowValues[SHEET_COL_INDEX.YYYY.gAcc1] = rpAcc1
              rowValues[SHEET_COL_INDEX.YYYY.gAcc2] = rpAcc2
              rowValues[SHEET_COL_INDEX.YYYY.gCategory] = rpCategory
              rowValues[SHEET_COL_INDEX.YYYY.gAmount] = rpAmount
              rowValues[SHEET_COL_INDEX.YYYY.gMemo] = rpMemo
              rowValues[SHEET_COL_INDEX.YYYY.gExecuted] =
                date.isBefore(today) || date.isSame(today, 'day')
              rowValues[SHEET_COL_INDEX.YYYY.g_rpID] = rpID
              rowValues[SHEET_COL_INDEX.YYYY.gDeleted] = ''
              rowValues[SHEET_COL_INDEX.YYYY.gTimestamp] = Date.now()

              if (!match) {
                newRows.push(rowValues)
                addedCount++
                hasChanges = true
              } else if (match.gExecuted === false) {
                await updateSheetRow(year, match.sheetRowNo, rowValues)
                updatedCount++
                hasChanges = true
              }
            }
          }

          // 2. 기간 밖 내역 처리 (삭제 마킹)
          const outsideEntries = existingEntries.filter(
            (entry) =>
              entry.g_rpID === rpID &&
              !targetDateStrings.includes(entry.gDate) &&
              entry.gExecuted === false,
          )

          for (const entry of outsideEntries) {
            await markSheetRowDeleted(
              year,
              entry.sheetRowNo,
              SHEET_COL_INDEX.YYYY.gDeleted,
            )
            deletedCount++
            hasChanges = true
          }

          // 일괄 추가 (Batch Append) 적용
          if (newRows.length > 0) {
            await ensureSheetExists(year)
            await appendSheetRows(year, newRows)
          }

          if (hasChanges) {
            await loadSheet연도Data(year) // 반복 처리는 여전히 복잡하므로 깔끔하게 재조회
          }
        }

        return { addedCount, updatedCount, deletedCount }
      } catch (error) {
        console.error('Error generating ledger from repeat:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [sheetYYYYData, loadedSheetYYYY, loadSheet연도Data, ensureSheetExists],
  )

  const yearData = useMemo(
    () => sheetYYYYData[selectedYear] || [],
    [sheetYYYYData, selectedYear],
  )

  const contextValue = useMemo(
    () => ({
      sheetYYYYData,
      loadedSheetYYYY,
      yearData,
      loading,
      selectedDate,
      setSelectedDate,
      loadSheet연도Data,
      updateLedgerEntry_gExecute,
      saveLedgerEntry,
      generateLedgerFromRepeat,
      deleteLedgerEntry,
    }),
    [
      sheetYYYYData,
      loadedSheetYYYY,
      yearData,
      loading,
      selectedDate,
      loadSheet연도Data,
      updateLedgerEntry_gExecute,
      saveLedgerEntry,
      generateLedgerFromRepeat,
      deleteLedgerEntry,
    ],
  )

  useEffect(() => {
    if (isSignedIn) {
      if (!loadedSheetYYYY[selectedYear]) {
        loadSheet연도Data(selectedYear)
      }
    } else {
      // 로그아웃 상태일 때 데이터 초기화 (이미 초기화된 경우 무한 루프 방지를 위해 체크)
      if (Object.keys(sheetYYYYData).length > 0) setSheetYYYYData({})
      if (Object.keys(loadedSheetYYYY).length > 0) setLoadedSheetYYYY({})
    }
  }, [
    isSignedIn,
    selectedYear,
    loadedSheetYYYY,
    loadSheet연도Data,
    sheetYYYYData,
  ])

  return (
    <YYYYContext.Provider value={contextValue}>{children}</YYYYContext.Provider>
  )
}

export const useYYYYData = () => useContext(YYYYContext)
