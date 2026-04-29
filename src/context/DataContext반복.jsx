import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { fetchSheetData, updateSheetCell, appendSheetRow, updateSheetRow } from '@/api/sheetApi';
import { parseAmount } from '@/utils/dataUtils';
import { useAuth } from '@/context/AuthContext';
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants';
import dayjs from 'dayjs';

const RepeatContext = createContext(null);

export const RepeatProvider = ({ children }) => {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sheet반복Data, setSheet반복Data] = useState([]);

  useEffect(() => {
    if (isSignedIn) {
      loadSheet반복Data();
    }
  }, [isSignedIn]);

  const loadSheet반복Data = useCallback(async () => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.REPEAT);
      const parsedData = [];

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        if (row[SHEET_COL_INDEX.REPEAT.rpDeleted]) continue;

        parsedData.push({
          sheetName: '반복',
          sheetRowNo: i + 1,
          rpID: row[SHEET_COL_INDEX.REPEAT.rpID] || '',
          rpDateS: row[SHEET_COL_INDEX.REPEAT.rpDateS] || '',
          rpDateE: row[SHEET_COL_INDEX.REPEAT.rpDateE] || '',
          rpPeriod: row[SHEET_COL_INDEX.REPEAT.rpPeriod] || '',
          rpDay: row[SHEET_COL_INDEX.REPEAT.rpDay] || '',
          rpCompleted: (String(row[SHEET_COL_INDEX.REPEAT.rpCompleted]).toUpperCase() === 'TRUE'),
          rpType: row[SHEET_COL_INDEX.REPEAT.rpType] || '',
          rpAcc1: row[SHEET_COL_INDEX.REPEAT.rpAcc1] || '',
          rpAcc2: row[SHEET_COL_INDEX.REPEAT.rpAcc2] || '',
          rpCategory: row[SHEET_COL_INDEX.REPEAT.rpCategory] || '',
          rpAmount: parseAmount(row[SHEET_COL_INDEX.REPEAT.rpAmount]),
          rpTotalAmount: parseAmount(row[SHEET_COL_INDEX.REPEAT.rpTotalAmount]),
          rpMemo: row[SHEET_COL_INDEX.REPEAT.rpMemo] || '',
          rpDeleted: (String(row[SHEET_COL_INDEX.REPEAT.rpDeleted]).toUpperCase() === 'TRUE')
        });
      }

      setSheet반복Data(parsedData.reverse());
    } catch (error) {
      console.error('Repeat data loading error', error);
      setSheet반복Data([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange_rpCompleted = useCallback(async (rowData, newValue) => {
    setSheet반복Data(prevData => prevData.map(item =>
      item.sheetRowNo === rowData.sheetRowNo
        ? { ...item, rpCompleted: newValue }
        : item
    ));

    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.REPEAT.rpCompleted);
      await updateSheetCell(`반복!${sheetColName}${rowData.sheetRowNo}`, newValue);
    } catch (error) {
      setSheet반복Data(prevData => prevData.map(item =>
        item.sheetRowNo === rowData.sheetRowNo
          ? { ...item, rpCompleted: !newValue }
          : item
      ));
    }
  }, []);

  const saveRepeatEntry = useCallback(async (repeat, formData) => {
    setLoading(true);
    try {
      const rowValues = [];
      const rpID = repeat ? repeat.rpID : Date.now().toString();

      rowValues[SHEET_COL_INDEX.REPEAT.rpID] = rpID;
      rowValues[SHEET_COL_INDEX.REPEAT.rpDateS] = formData.rpDateS ? dayjs(formData.rpDateS).format('YYYY-MM-DD') : '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpDateE] = formData.rpDateE ? dayjs(formData.rpDateE).format('YYYY-MM-DD') : '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpPeriod] = formData.rpPeriod || 'M';
      rowValues[SHEET_COL_INDEX.REPEAT.rpDay] = formData.rpDay || '1';
      rowValues[SHEET_COL_INDEX.REPEAT.rpCompleted] = formData.rpCompleted ?? false;
      rowValues[SHEET_COL_INDEX.REPEAT.rpType] = formData.rpType || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpAcc1] = formData.rpAcc1 || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpAcc2] = formData.rpAcc2 || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpCategory] = formData.rpCategory || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpAmount] = formData.rpAmount || 0;
      rowValues[SHEET_COL_INDEX.REPEAT.rpTotalAmount] = formData.rpTotalAmount || 0;
      rowValues[SHEET_COL_INDEX.REPEAT.rpMemo] = formData.rpMemo || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpDeleted] = '';

      const newObj = {
        sheetName: '반복',
        sheetRowNo: repeat ? repeat.sheetRowNo : 0, // updated below
        rpID: rowValues[SHEET_COL_INDEX.REPEAT.rpID],
        rpDateS: rowValues[SHEET_COL_INDEX.REPEAT.rpDateS],
        rpDateE: rowValues[SHEET_COL_INDEX.REPEAT.rpDateE],
        rpPeriod: rowValues[SHEET_COL_INDEX.REPEAT.rpPeriod],
        rpDay: rowValues[SHEET_COL_INDEX.REPEAT.rpDay],
        rpCompleted: rowValues[SHEET_COL_INDEX.REPEAT.rpCompleted],
        rpType: rowValues[SHEET_COL_INDEX.REPEAT.rpType],
        rpAcc1: rowValues[SHEET_COL_INDEX.REPEAT.rpAcc1],
        rpAcc2: rowValues[SHEET_COL_INDEX.REPEAT.rpAcc2],
        rpCategory: rowValues[SHEET_COL_INDEX.REPEAT.rpCategory],
        rpAmount: rowValues[SHEET_COL_INDEX.REPEAT.rpAmount],
        rpTotalAmount: rowValues[SHEET_COL_INDEX.REPEAT.rpTotalAmount],
        rpMemo: rowValues[SHEET_COL_INDEX.REPEAT.rpMemo],
        rpDeleted: false
      };

      if (!repeat) {
        const res = await appendSheetRow('반복', rowValues);
        if (res && res.updates && res.updates.updatedRange) {
          const match = res.updates.updatedRange.split(':')[0].match(/\d+/);
          if (match) newObj.sheetRowNo = parseInt(match[0], 10);
        }

        // Optimistic UI Update (추가)
        setSheet반복Data(prev => [newObj, ...prev]);
      } else {
        await updateSheetRow('반복', repeat.sheetRowNo, rowValues);

        // Optimistic UI Update (수정)
        setSheet반복Data(prev => prev.map(item => item.sheetRowNo === repeat.sheetRowNo ? { ...item, ...newObj } : item));
      }

      return rpID;
    } catch (error) {
      console.error('Error saving repeat entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRepeatEntry = useCallback(async (repeat) => {
    if (!repeat) return;
    setLoading(true);
    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.REPEAT.rpDeleted);
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      await updateSheetCell(`반복!${sheetColName}${repeat.sheetRowNo}`, timestamp);

      // Optimistic UI Update (삭제)
      setSheet반복Data(prev => prev.filter(item => item.sheetRowNo !== repeat.sheetRowNo));

      return true;
    } catch (error) {
      console.error('Error deleting repeat entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    sheet반복Data,
    loading,
    loadSheet반복Data,
    handleChange_rpCompleted,
    saveRepeatEntry,
    deleteRepeatEntry
  }), [
    sheet반복Data,
    loading,
    loadSheet반복Data,
    handleChange_rpCompleted,
    saveRepeatEntry,
    deleteRepeatEntry
  ]);

  return (
    <RepeatContext.Provider value={contextValue}>
      {children}
    </RepeatContext.Provider>
  );
};

export const useRepeatData = () => useContext(RepeatContext);
