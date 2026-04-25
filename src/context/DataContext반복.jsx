import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSheetData, updateSheetCell, appendSheetRow, updateSheetRow } from '@/api/sheetApi';
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

  const loadSheet반복Data = async () => {
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
          rpComplete: (String(row[SHEET_COL_INDEX.REPEAT.rpComplete]).toUpperCase() === 'TRUE'),
          rpType: row[SHEET_COL_INDEX.REPEAT.rpType] || '',
          rpAcc1: row[SHEET_COL_INDEX.REPEAT.rpAcc1] || '',
          rpAcc2: row[SHEET_COL_INDEX.REPEAT.rpAcc2] || '',
          rpCategory: row[SHEET_COL_INDEX.REPEAT.rpCategory] || '',
          rpAmount: Number(String(row[SHEET_COL_INDEX.REPEAT.rpAmount] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '')) || 0,
          rpTotalAmount: Number(String(row[SHEET_COL_INDEX.REPEAT.rpTotalAmount] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '')) || 0,
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
  };

  const handleChange_rpComplete = async (rowData, newValue) => {
    setSheet반복Data(prevData => prevData.map(item =>
      item.sheetRowNo === rowData.sheetRowNo
        ? { ...item, rpComplete: newValue }
        : item
    ));

    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.REPEAT.rpComplete);
      await updateSheetCell(`반복!${sheetColName}${rowData.sheetRowNo}`, newValue);
    } catch (error) {
      setSheet반복Data(prevData => prevData.map(item =>
        item.sheetRowNo === rowData.sheetRowNo
          ? { ...item, rpComplete: !newValue }
          : item
      ));
    }
  };

  const saveRepeatEntry = async (repeat, formData) => {
    setLoading(true);
    try {
      const rowValues = [];
      const rpID = repeat ? repeat.rpID : Date.now().toString();

      rowValues[SHEET_COL_INDEX.REPEAT.rpID] = rpID;
      rowValues[SHEET_COL_INDEX.REPEAT.rpDateS] = formData.rpDateS ? dayjs(formData.rpDateS).format('YYYY-MM-DD') : '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpDateE] = formData.rpDateE ? dayjs(formData.rpDateE).format('YYYY-MM-DD') : '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpPeriod] = formData.rpPeriod || 'M';
      rowValues[SHEET_COL_INDEX.REPEAT.rpDay] = formData.rpDay || '1';
      rowValues[SHEET_COL_INDEX.REPEAT.rpComplete] = formData.rpComplete ?? false;
      rowValues[SHEET_COL_INDEX.REPEAT.rpType] = formData.rpType || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpAcc1] = formData.rpAcc1 || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpAcc2] = formData.rpAcc2 || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpCategory] = formData.rpCategory || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpAmount] = formData.rpAmount || 0;
      rowValues[SHEET_COL_INDEX.REPEAT.rpTotalAmount] = formData.rpTotalAmount || 0;
      rowValues[SHEET_COL_INDEX.REPEAT.rpMemo] = formData.rpMemo || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpDeleted] = ''; 

      if (!repeat) {
        await appendSheetRow('반복', rowValues);
      } else {
        await updateSheetRow('반복', repeat.sheetRowNo, rowValues);
      }

      await loadSheet반복Data();
      return true;
    } catch (error) {
      console.error('Error saving repeat entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRepeatEntry = async (repeat) => {
    if (!repeat) return;
    setLoading(true);
    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.REPEAT.rpDeleted);
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      await updateSheetCell(`반복!${sheetColName}${repeat.sheetRowNo}`, timestamp);

      await loadSheet반복Data();
      return true;
    } catch (error) {
      console.error('Error deleting repeat entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RepeatContext.Provider value={{
      sheet반복Data,
      loading,
      loadSheet반복Data,
      handleChange_rpComplete,
      saveRepeatEntry,
      deleteRepeatEntry
    }}>
      {children}
    </RepeatContext.Provider>
  );
};

export const useRepeatData = () => useContext(RepeatContext);
