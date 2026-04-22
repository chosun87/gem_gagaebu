import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchSheetData, updateSheetCell, appendSheetRow, updateSheetRow, createSheet, updateSheetHeaders } from '@/api/sheetApi';
import { useAuth } from '@/context/AuthContext';
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants';
import dayjs from 'dayjs';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { isSignedIn } = useAuth();

  const [loading, setLoading] = useState(false);

  // 시트 데이터 상태
  const [sheet자산Data, setSheet자산Data] = useState([]);
  const [sheet반복Data, setSheet반복Data] = useState([]);
  const [sheetYYYYData, setSheetYYYYData] = useState({});
  const [loadedSheetYYYY, setLoadedSheetYYYY] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());

  // 코드 데이터 (반복주기 등)
  const [periodOptions, setPeriodOptions] = useState([]);
  const [categoryNodes, setCategoryNodes] = useState([]);

  useEffect(() => {
    if (isSignedIn) {
      loadSheet반복Data();
      loadSheet자산Data();
      loadSheet코드Data();
    }
  }, [isSignedIn]);

  const loadSheet코드Data = async () => {
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.CODE);
      const periods = [];
      const categoryMap = {};

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        if (row[SHEET_COL_INDEX.CODE.cdDeleted]) continue;

        const group = row[SHEET_COL_INDEX.CODE.cdGroup];
        if (group === '반복주기') {
          periods.push({
            label: row[SHEET_COL_INDEX.CODE.cdLabel],
            value: row[SHEET_COL_INDEX.CODE.cd]
          });
        } else if (['지출', '이체', '수입'].includes(group) || group.includes('분류')) {
          const categoryKey = group.replace('분류', '');
          if (!categoryMap[categoryKey]) {
            categoryMap[categoryKey] = {
              key: categoryKey,
              label: group,
              selectable: false,
              children: []
            };
          }
          categoryMap[categoryKey].children.push({
            key: row[SHEET_COL_INDEX.CODE.cd],
            label: row[SHEET_COL_INDEX.CODE.cdLabel],
            data: row[SHEET_COL_INDEX.CODE.cd],
            icon: row[SHEET_COL_INDEX.CODE.cdIcon] || 'pi pi-fw pi-tag'
          });
        }
      }
      setPeriodOptions(periods);
      setCategoryNodes(Object.values(categoryMap));
    } catch (error) {
      console.error('Code data loading error', error);
    }
  };

  const loadSheet자산Data = async () => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.ASSET);
      const parsedData = [];

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        if (row[SHEET_COL_INDEX.ASSET.accDeleted]) continue;

        parsedData.push({
          accType: row[SHEET_COL_INDEX.ASSET.accType] || '',
          accCode: row[SHEET_COL_INDEX.ASSET.accCode] || '',
          accLabel: row[SHEET_COL_INDEX.ASSET.accLabel] || '',
          accIcon: row[SHEET_COL_INDEX.ASSET.accIcon] || '',
          accDefault: (String(row[SHEET_COL_INDEX.ASSET.accDefault]).toUpperCase() === 'TRUE'),
          accOrder: Number(row[SHEET_COL_INDEX.ASSET.accOrder]) || 0,
        });
      }

      setSheet자산Data(parsedData);
    } catch (error) {
      console.error('Asset data loading error', error);
      setSheet자산Data([]);
    } finally {
      setLoading(false);
    }
  };

  // TreeSelect용 자산 노드 생성
  const assetNodes = useMemo(() => {
    const groups = {};

    // accType + accOrder 정렬
    const sortedData = [...sheet자산Data].sort((a, b) => {
      if (a.accType < b.accType) return -1;
      if (a.accType > b.accType) return 1;
      return a.accOrder - b.accOrder;
    });

    sortedData.forEach(item => {
      if (!groups[item.accType]) {
        groups[item.accType] = {
          key: item.accType,
          label: item.accType,
          selectable: false,
          children: []
        };
      }
      groups[item.accType].children.push({
        key: item.accCode,
        label: item.accLabel,
        data: item.accCode,
        icon: item.accIcon || 'pi pi-fw pi-wallet'
      });
    });

    return Object.values(groups);
  }, [sheet자산Data]);

  // 기본 자산 코드 추출
  const defaultAssetCode = useMemo(() => {
    const defaultItem = sheet자산Data.find(item => item.accDefault);
    return defaultItem ? defaultItem.accCode : '';
  }, [sheet자산Data]);

  // 반복 시트 데이터 로드

  const loadSheet반복Data = async () => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.REPEAT);
      const parsedData = [];

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        // 삭제 마킹된 행 제외
        if (row[SHEET_COL_INDEX.REPEAT.rpDeleted]) continue;

        parsedData.push({
          sheetName: '반복',
          sheetRowNo: i + 1,
          rpID: row[SHEET_COL_INDEX.REPEAT.rpID] || '',
          rpDateS: row[SHEET_COL_INDEX.REPEAT.rpDateS] || '',
          rpDateE: row[SHEET_COL_INDEX.REPEAT.rpDateE] || '',
          rpPeriod: row[SHEET_COL_INDEX.REPEAT.rpPeriod] || '',
          rpDay: row[SHEET_COL_INDEX.REPEAT.rpDay] || '',
          rpComplete: (String(row[SHEET_COL_INDEX.REPEAT.rpComplete]).toUpperCase() === 'TRUE') ? true : false,
          rpType: row[SHEET_COL_INDEX.REPEAT.rpType] || '',
          rpAcc1: row[SHEET_COL_INDEX.REPEAT.rpAcc1] || '',
          rpAcc2: row[SHEET_COL_INDEX.REPEAT.rpAcc2] || '',
          rpCategory: row[SHEET_COL_INDEX.REPEAT.rpCategory] || '',
          rpAmount: Number(String(row[SHEET_COL_INDEX.REPEAT.rpAmount] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '')) || 0,
          rpMemo: row[SHEET_COL_INDEX.REPEAT.rpMemo] || '',
        });
      }

      setSheet반복Data(parsedData.reverse());
    } catch (error) {
      console.error('Data loading error', error);
      setSheet반복Data([]);
    } finally {
      setLoading(false);
    }
  }

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
  }, [isSignedIn, selectedYear]);

  const loadSheet연도Data = async (targetYear) => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.YEAR.replace("YYYY", targetYear));
      const parsedData = [];

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        // 삭제 마킹된 행 제외
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
          gExecuted: (String(row[SHEET_COL_INDEX.YYYY.gExecuted]).toUpperCase() === 'TRUE') ? true : false,
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
      console.error('Data loading error', error);
      setSheetYYYYData(prev => ({ ...prev, [targetYear]: [] }));
      setLoadedSheetYYYY(prev => ({ ...prev, [targetYear]: true }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange_gExecute = async (rowData, newValue) => {
    const YYYY = rowData.sheetName; // 연도

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

  // 가계부 데이터 저장 (신규/수정/이동)
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
      rowValues[SHEET_COL_INDEX.YYYY.gDeleted] = ''; // 초기값은 비어있음

      const ensureSheetExists = async (sheetName) => {
        try {
          await fetchSheetData(`${sheetName}!A1:A1`);
        } catch (error) {
          // 시트가 없으면 생성 및 헤더 초기화
          await createSheet(sheetName);
          const headers = Object.keys(SHEET_COL_INDEX.YYYY).sort((a, b) => SHEET_COL_INDEX.YYYY[a] - SHEET_COL_INDEX.YYYY[b]);
          await updateSheetHeaders(sheetName, headers);
        }
      };

      if (!ledger) {
        // [신규 입력]
        await ensureSheetExists(newYear);
        await appendSheetRow(newYear, rowValues);
      } else {
        // [기존 수정]
        if (ledger.sheetName === newYear) {
          // 연도 동일: 기존 행 업데이트
          await updateSheetRow(newYear, ledger.sheetRowNo, rowValues);
        } else {
          // 연도 변경: 기존 행 삭제 마킹 후 새 연도에 추가
          const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.YYYY.gDeleted);
          await updateSheetCell(`${ledger.sheetName}!${sheetColName}${ledger.sheetRowNo}`, dayjs().format('YYYY-MM-DD HH:mm:ss'));

          await ensureSheetExists(newYear);
          await appendSheetRow(newYear, rowValues);
        }
      }

      // 데이터 갱신
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

  // 가계부 데이터 삭제 (마킹)
  const deleteLedgerEntry = async (ledger) => {
    if (!ledger) return;
    setLoading(true);
    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.YYYY.gDeleted);
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      await updateSheetCell(`${ledger.sheetName}!${sheetColName}${ledger.sheetRowNo}`, timestamp);

      // 데이터 갱신
      await loadSheet연도Data(ledger.sheetName);
      return true;
    } catch (error) {
      console.error('Error deleting ledger entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 반복 데이터 삭제 (마킹)
  const deleteRepeatEntry = async (repeat) => {
    if (!repeat) return;
    setLoading(true);
    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.REPEAT.rpDeleted);
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      await updateSheetCell(`반복!${sheetColName}${repeat.sheetRowNo}`, timestamp);

      // 데이터 갱신
      await loadSheet반복Data();
      return true;
    } catch (error) {
      console.error('Error deleting repeat entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // List.jsx 등 다른 컴포넌트와의 호환성을 위해 현재 선택된 연도의 데이터를 yearData로 제공
  const yearData = sheetYYYYData[selectedYear] || [];

  // 반복 데이터 저장 (신규/수정)
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
      rowValues[SHEET_COL_INDEX.REPEAT.rpMemo] = formData.rpMemo || '';
      rowValues[SHEET_COL_INDEX.REPEAT.rpDeleted] = ''; // 초기값

      if (!repeat) {
        // [신규 입력]
        await appendSheetRow('반복', rowValues);
      } else {
        // [기존 수정]
        await updateSheetRow('반복', repeat.sheetRowNo, rowValues);
      }

      // 데이터 갱신
      await loadSheet반복Data();
      return true;
    } catch (error) {
      console.error('Error saving repeat entry:', error);
      throw error;
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
      handleChange_rpComplete,
      saveLedgerEntry,
      deleteLedgerEntry,
      saveRepeatEntry,
      deleteRepeatEntry,
      assetNodes,
      categoryNodes,
      defaultAssetCode,
      periodOptions,
      selectedDate,
      setSelectedDate,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
