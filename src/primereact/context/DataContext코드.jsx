import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { fetchSheetData } from '@/api/sheetApi';
import { useAuth } from '@/context/AuthContext';
import {
  SHEET_NAME_RANGE,
  SHEET_COL_INDEX,
  TRANSACTION_TYPE,
} from '@/assets/js/constants';

const CodeContext = createContext(null);

export const CodeProvider = ({ children }) => {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [assetOptions, setAssetOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  const loadSheet코드Data = useCallback(async () => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.CODE);
      const periodCds = [];
      const assetCds = [];
      const categoryCds = {};
      const catMap = {};

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 2) continue;

        const getVal = (idx) =>
          row[idx] !== undefined ? String(row[idx]).trim() : '';

        // 삭제 여부 체크
        const deletedVal = getVal(SHEET_COL_INDEX.CODE.cdDeleted);
        const isDeleted =
          deletedVal !== '' && deletedVal.toUpperCase() !== 'FALSE';

        if (isDeleted) continue;

        const cdGroup = getVal(SHEET_COL_INDEX.CODE.cdGroup);
        const cd = getVal(SHEET_COL_INDEX.CODE.cd);
        const cdLabel = getVal(SHEET_COL_INDEX.CODE.cdLabel);
        const cdTimestamp = getVal(SHEET_COL_INDEX.CODE.cdTimestamp);

        if (cdGroup === '반복주기') {
          periodCds.push({ cd, cdLabel, cdTimestamp });
        } else if (cdGroup === '자산') {
          assetCds.push({
            cd,
            cdLabel,
            cdIcon: getVal(SHEET_COL_INDEX.CODE.cdIcon) || 'pi pi-tag',
            cdTimestamp,
          });
        } else if (
          [
            TRANSACTION_TYPE.EXPENSE,
            TRANSACTION_TYPE.TRANSFER,
            TRANSACTION_TYPE.INCOME,
          ].includes(cdGroup.replace('분류', '')) ||
          cdGroup.includes('분류')
        ) {
          const finalGroup = cdGroup.replace('분류', '');
          if (!categoryCds[finalGroup]) {
            categoryCds[finalGroup] = {
              cdGroup: finalGroup,
              label: finalGroup,
              selectable: false,
              children: [],
            };
          }
          const catInfo = {
            cd,
            cdLabel,
            cdIcon:
              (getVal(SHEET_COL_INDEX.CODE.cdIcon) || 'pi pi-fw pi-tag') +
              ` gType-${finalGroup}`,
            cdDefaultAcc1: getVal(SHEET_COL_INDEX.CODE.cdDefaultAcc1),
            cdAddSum: getVal(SHEET_COL_INDEX.CODE.cdAddSum) !== 'FALSE', // 기본값은 true
            cdOrder: Number(getVal(SHEET_COL_INDEX.CODE.cdOrder)) || 999,
            cdTimestamp,
          };
          categoryCds[finalGroup].children.push(catInfo);
          catMap[catInfo.cd] = catInfo;
        }
      }
      setPeriodOptions(periodCds);
      setAssetOptions(assetCds);
      setCategoryOptions(Object.values(categoryCds));
      setCategoryMap(catMap);
    } catch (error) {
      console.error('Code data loading error', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 추후 CRUD를 위한 스텁 (Stub for future CRUD)
  const saveCodeEntry = useCallback(async (entry) => {
    console.log('saveCodeEntry stub', entry);
    return true;
  }, []);

  const deleteCodeEntry = useCallback(async (entry) => {
    console.log('deleteCodeEntry stub', entry);
    return true;
  }, []);

  const contextValue = useMemo(
    () => ({
      periodOptions,
      assetOptions,
      categoryOptions,
      categoryMap,
      loading,
      loadSheet코드Data,
      saveCodeEntry,
      deleteCodeEntry,
    }),
    [
      periodOptions,
      assetOptions,
      categoryOptions,
      categoryMap,
      loading,
      loadSheet코드Data,
      saveCodeEntry,
      deleteCodeEntry,
    ],
  );

  useEffect(() => {
    if (isSignedIn) {
      loadSheet코드Data();
    }
  }, [isSignedIn, loadSheet코드Data]);

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <CodeContext.Provider value={contextValue}>{children}</CodeContext.Provider>
  );
};

export const useCodeData = () => useContext(CodeContext);
