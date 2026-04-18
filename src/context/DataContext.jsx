import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSheetData, updateSheetCell } from '@/api/sheetApi';
import { useAuth } from '@/context/AuthContext';
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants';
import dayjs from 'dayjs';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { isSignedIn } = useAuth();

  const [loading, setLoading] = useState(false);


  // 반복 시트 데이터 로드
  const [sheet반복Data, setSheet반복Data] = useState({});

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

        parsedData.push({
          sheetName: '반복',
          sheetRowNo: i + 1,
          rpID: row[SHEET_COL_INDEX.rpID] || '',
          rpDateS: row[SHEET_COL_INDEX.rpDateS] || '',
          rpDateE: row[SHEET_COL_INDEX.rpDateE] || '',
          rpDay: row[SHEET_COL_INDEX.rpDay] || '',
          rpComplete: (String(row[SHEET_COL_INDEX.rpComplete]).toUpperCase() === 'TRUE') ? true : false,
          rpType: row[SHEET_COL_INDEX.rpType] || '',
          rpAcc1: row[SHEET_COL_INDEX.rpAcc1] || '',
          rpAcc2: row[SHEET_COL_INDEX.rpAcc2] || '',
          rpCategory: row[SHEET_COL_INDEX.rpCategory] || '',
          rpAmount: Number(String(row[SHEET_COL_INDEX.rpAmount] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '')) || 0,
          rpMemo: row[SHEET_COL_INDEX.rpMemo] || '',
        });
      }

      setSheet반복Data(parsedData.reverse());
    } catch (error) {
      console.error('Data loading error', error);
      // 에러 시에도 무한 반복 패치를 막기 위해 true로 설정, 데이터는 빈 배열
      setSheet반복Data([]);
    } finally {
      setLoading(false);
    }
  }

  // 연도 시트 데이터 로드
  const [sheetYYYYData, setSheetYYYYData] = useState({});
  const [loadedSheetYYYY, setLoadedSheetYYYY] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());

  // 선택된 연도 추적
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
  }, [isSignedIn, selectedYear, loadedSheetYYYY[selectedYear]]);

  const loadSheet연도Data = async (targetYear) => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.YEAR.replace("YYYY", targetYear));
      const parsedData = [];

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        parsedData.push({
          sheetName: targetYear,
          sheetRowNo: i + 1,
          gDate: row[SHEET_COL_INDEX.gDate] || '',
          gType: row[SHEET_COL_INDEX.gType] || '',
          gAcc1: row[SHEET_COL_INDEX.gAcc1] || '',
          gAcc2: row[SHEET_COL_INDEX.gAcc2] || '',
          gCategory: row[SHEET_COL_INDEX.gCategory] || '',
          gAmount: Number(String(row[SHEET_COL_INDEX.gAmount] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '')) || 0,
          gMemo: row[SHEET_COL_INDEX.gMemo] || '',
          gExecuted: (String(row[SHEET_COL_INDEX.gExecuted]).toUpperCase() === 'TRUE') ? true : false,
          g_rpID: row[SHEET_COL_INDEX.g_rpID] || '',
        });
      }

      setSheetYYYYData(prev => ({ ...prev, [targetYear]: parsedData.reverse() }));
      setLoadedSheetYYYY(prev => ({ ...prev, [targetYear]: true }));
    } catch (error) {
      console.error('Data loading error', error);
      // 에러 시에도 무한 반복 패치를 막기 위해 true로 설정, 데이터는 빈 배열
      setSheetYYYYData(prev => ({ ...prev, [targetYear]: [] }));
      setLoadedSheetYYYY(prev => ({ ...prev, [targetYear]: true }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange_gExecute = async (rowData, newValue) => {
    const YYYY = rowData.sheetName; // 연도

    // 1. 화면 즉각 업데이트(Optimistic Update)
    setSheetYYYYData(prev => ({
      ...prev,
      [YYYY]: (prev[YYYY] || []).map(item =>
        item.sheetRowNo === rowData.sheetRowNo
          ? { ...item, gExecuted: newValue }
          : item
      )
    }));

    // (여기서는 불필요) 사용자 요구사항: 데이터 변경이 있으면 loadedSheetYYYY 값을 false로 변경
    // setLoadedSheetYYYY(prev => ({ ...prev, [YYYY]: false }));

    // 2. 구글 시트 실제 값 쓰기 업데이트
    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.gExecuted);
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

  // List.jsx 등 다른 컴포넌트와의 호환성을 위해 현재 선택된 연도의 데이터를 yearData로 제공
  const yearData = sheetYYYYData[selectedYear] || [];

  const handleChange_rpComplete = async (rowData, newValue) => {
    setSheet반복Data(prevData => prevData.map(item =>
      item.sheetRowNo === rowData.sheetRowNo
        ? { ...item, rpComplete: newValue }
        : item
    ));

    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.rpComplete);
      await updateSheetCell(`반복!${sheetColName}${rowData.sheetRowNo}`, newValue);
    } catch (error) {
      setSheet반복Data(prevData => prevData.map(item =>
        item.sheetRowNo === rowData.sheetRowNo
          ? { ...item, rpComplete: !newValue }
          : item
      ));
    }
  };

  return (
    <DataContext.Provider value={{
      sheet반복Data,
      sheetYYYYData,
      loadedSheetYYYY,
      yearData,
      loading,
      selectedDate,
      setSelectedDate,
      handleChange_gExecute,
      handleChange_rpComplete
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
