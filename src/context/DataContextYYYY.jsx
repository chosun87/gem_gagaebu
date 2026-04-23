import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchSheetData, updateSheetCell, appendSheetRow, updateSheetRow, createSheet, updateSheetHeaders } from '@/api/sheetApi';
import { useAuth } from '@/context/AuthContext';
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants';
import dayjs from 'dayjs';

const YYYYContext = createContext(null);

export const YYYYProvider = ({ children }) => {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sheetYYYYData, setSheetYYYYData] = useState({});
  const [loadedSheetYYYY, setLoadedSheetYYYY] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedYear = selectedDate.getFullYear().toString();

  useEffect(() => {
    if (isSignedIn) {
      if (!loadedSheetYYYY[selectedYear]) {
        loadSheet연도Data(selectedYear);
      }
    } else {
      setSheetYYYYData({});
      setLoadedSheetYYYY({});
    }
  }, [isSignedIn, selectedYear]);

  const loadSheet연도Data = async (targetYear) => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.YEAR.replace("YYYY", targetYear));
      const parsedData = [];

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        if (row[SHEET_COL_INDEX.YYYY.gDeleted]) continue;

        parsedData.push({
          sheetName: targetYear,
          sheetRowNo: i + 1,
          gDate: row[SHEET_COL_INDEX.YYYY.gDate] || '',
          gType: row[SHEET_COL_INDEX.YYYY.gType] || '',
          gAcc1: row[SHEET_COL_INDEX.YYYY.gAcc1] || '',
          gAcc2: row[SHEET_COL_INDEX.YYYY.gAcc2] || '',
          gCategory: row[SHEET_COL_INDEX.YYYY.gCategory] || '',
          gAmount: Number(String(row[SHEET_COL_INDEX.YYYY.gAmount] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '')) || 0,
          gMemo: row[SHEET_COL_INDEX.YYYY.gMemo] || '',
          gExecuted: (String(row[SHEET_COL_INDEX.YYYY.gExecuted]).toUpperCase() === 'TRUE'),
          g_rpID: row[SHEET_COL_INDEX.YYYY.g_rpID] || '',
        });
      }

      const sortedData = parsedData.sort((a, b) => {
        const diff = dayjs(b.gDate).unix() - dayjs(a.gDate).unix();
        if (diff !== 0) return diff;
        return b.sheetRowNo - a.sheetRowNo;
      });
      setSheetYYYYData(prev => ({ ...prev, [targetYear]: sortedData }));
      setLoadedSheetYYYY(prev => ({ ...prev, [targetYear]: true }));
    } catch (error) {
      console.error('Yearly data loading error', error);
      setSheetYYYYData(prev => ({ ...prev, [targetYear]: [] }));
      setLoadedSheetYYYY(prev => ({ ...prev, [targetYear]: true }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange_gExecute = async (rowData, newValue) => {
    const YYYY = rowData.sheetName;

    setSheetYYYYData(prev => ({
      ...prev,
      [YYYY]: (prev[YYYY] || []).map(item =>
        item.sheetRowNo === rowData.sheetRowNo
          ? { ...item, gExecuted: newValue }
          : item
      )
    }));

    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.YYYY.gExecuted);
      await updateSheetCell(`${rowData.sheetName}!${sheetColName}${rowData.sheetRowNo}`, newValue);
    } catch (error) {
      setSheetYYYYData(prev => ({
        ...prev,
        [YYYY]: (prev[YYYY] || []).map(item =>
          item.sheetRowNo === rowData.sheetRowNo
            ? { ...item, gExecuted: !newValue }
            : item
        )
      }));
    }
  };

  const saveLedgerEntry = async (ledger, formData) => {
    setLoading(true);
    try {
      const gDate = dayjs(formData.gDate);
      const newYear = gDate.format('YYYY');

      const rowValues = [];
      rowValues[SHEET_COL_INDEX.YYYY.gDate] = gDate.format('YYYY-MM-DD');
      rowValues[SHEET_COL_INDEX.YYYY.gType] = formData.gType || '';
      rowValues[SHEET_COL_INDEX.YYYY.gAcc1] = formData.gAcc1 || '';
      rowValues[SHEET_COL_INDEX.YYYY.gAcc2] = formData.gAcc2 || '';
      rowValues[SHEET_COL_INDEX.YYYY.gCategory] = formData.gCategory || '';
      rowValues[SHEET_COL_INDEX.YYYY.gAmount] = formData.gAmount || 0;
      rowValues[SHEET_COL_INDEX.YYYY.gMemo] = formData.gMemo || '';
      rowValues[SHEET_COL_INDEX.YYYY.gExecuted] = formData.gExecuted ?? false;
      rowValues[SHEET_COL_INDEX.YYYY.g_rpID] = formData.g_rpID || '';
      rowValues[SHEET_COL_INDEX.YYYY.gDeleted] = '';

      const ensureSheetExists = async (sheetName) => {
        try {
          await fetchSheetData(`${sheetName}!A1:A1`);
        } catch (error) {
          await createSheet(sheetName);
          const headers = Object.keys(SHEET_COL_INDEX.YYYY).sort((a, b) => SHEET_COL_INDEX.YYYY[a] - SHEET_COL_INDEX.YYYY[b]);
          await updateSheetHeaders(sheetName, headers);
        }
      };

      if (!ledger) {
        await ensureSheetExists(newYear);
        await appendSheetRow(newYear, rowValues);
      } else {
        if (ledger.sheetName === newYear) {
          await updateSheetRow(newYear, ledger.sheetRowNo, rowValues);
        } else {
          const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.YYYY.gDeleted);
          await updateSheetCell(`${ledger.sheetName}!${sheetColName}${ledger.sheetRowNo}`, dayjs().format('YYYY-MM-DD HH:mm:ss'));

          await ensureSheetExists(newYear);
          await appendSheetRow(newYear, rowValues);
        }
      }

      await loadSheet연도Data(newYear);
      if (ledger && ledger.sheetName !== newYear) {
        await loadSheet연도Data(ledger.sheetName);
      }
      return true;
    } catch (error) {
      console.error('Error saving ledger entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteLedgerEntry = async (ledger) => {
    if (!ledger) return;
    setLoading(true);
    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.YYYY.gDeleted);
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      await updateSheetCell(`${ledger.sheetName}!${sheetColName}${ledger.sheetRowNo}`, timestamp);

      await loadSheet연도Data(ledger.sheetName);
      return true;
    } catch (error) {
      console.error('Error deleting ledger entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const yearData = useMemo(() => sheetYYYYData[selectedYear] || [], [sheetYYYYData, selectedYear]);

  return (
    <YYYYContext.Provider value={{
      sheetYYYYData,
      loadedSheetYYYY,
      yearData,
      loading,
      selectedDate,
      setSelectedDate,
      loadSheet연도Data,
      handleChange_gExecute,
      saveLedgerEntry,
      deleteLedgerEntry
    }}>
      {children}
    </YYYYContext.Provider>
  );
};

export const useYYYYData = () => useContext(YYYYContext);
