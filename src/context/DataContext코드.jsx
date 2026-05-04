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
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants';

const CodeContext = createContext(null);

export const CodeProvider = ({ children }) => {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  const loadSheet코드Data = useCallback(async () => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.CODE);
      const periodCds = [];
      const categoryCds = {};
      const catMap = {};

      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        if (row[SHEET_COL_INDEX.CODE.cdDeleted]) continue;

        const group = row[SHEET_COL_INDEX.CODE.cdGroup];
        if (group === '반복주기') {
          periodCds.push({
            cd: row[SHEET_COL_INDEX.CODE.cd],
            cdLabel: row[SHEET_COL_INDEX.CODE.cdLabel],
          });
        } else if (
          ['지출', '이체', '수입'].includes(group) ||
          group.includes('분류')
        ) {
          const cdGroup = group.replace('분류', '');
          if (!categoryCds[cdGroup]) {
            categoryCds[cdGroup] = {
              cdGroup: cdGroup,
              label: cdGroup,
              selectable: false,
              children: [],
            };
          }
          const catInfo = {
            cd: row[SHEET_COL_INDEX.CODE.cd],
            cdLabel: row[SHEET_COL_INDEX.CODE.cdLabel],
            cdIcon:
              (row[SHEET_COL_INDEX.CODE.cdIcon] || 'pi pi-fw pi-tag') +
              ` gType-${cdGroup}`,
            cdDefaultAcc1: row[SHEET_COL_INDEX.CODE.cdDefaultAcc1] || '',
            cdAddSum: row[SHEET_COL_INDEX.CODE.cdAddSum] !== 'FALSE', // 기본값은 true (FALSE가 아닐 때)
          };
          categoryCds[cdGroup].children.push(catInfo);
          catMap[catInfo.cd] = catInfo;
        }
      }
      setPeriodOptions(periodCds);
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
      categoryOptions,
      categoryMap,
      loading,
      loadSheet코드Data,
      saveCodeEntry,
      deleteCodeEntry,
    }),
    [
      periodOptions,
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
