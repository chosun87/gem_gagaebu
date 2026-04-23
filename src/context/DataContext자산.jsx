import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchSheetData } from '@/api/sheetApi';
import { useAuth } from '@/context/AuthContext';
import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants';

const AssetContext = createContext(null);

export const AssetProvider = ({ children }) => {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sheet자산Data, setSheet자산Data] = useState([]);

  useEffect(() => {
    if (isSignedIn) {
      loadSheet자산Data();
    }
  }, [isSignedIn]);

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
          accMemo: row[SHEET_COL_INDEX.ASSET.accMemo] || '',
          accDeleted: (String(row[SHEET_COL_INDEX.ASSET.accDeleted]).toUpperCase() === 'TRUE')
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

  const assetNodes = useMemo(() => {
    const groups = {};

    const sortedData = [...sheet자산Data].sort((a, b) => {
      if (a.accType < b.accType) return -1;
      if (a.accType > b.accType) return 1;
      return a.accOrder - b.accOrder;
    });

    sortedData.forEach(item => {
      if (!groups[item.accType]) {
        groups[item.accType] = {
          accType: item.accType,
          selectable: false,
          children: []
        };
      }
      groups[item.accType].children.push({
        accCode: item.accCode,
        accLabel: item.accLabel,
        accIcon: item.accIcon || 'pi pi-fw pi-wallet',
        accDefault: item.accDefault,
        accOrder: item.accOrder,
        accMemo: item.accMemo,
      });
    });

    return Object.values(groups);
  }, [sheet자산Data]);

  const defaultAssetCode = useMemo(() => {
    const defaultItem = sheet자산Data.find(item => item.accDefault);
    return defaultItem ? defaultItem.accCode : '';
  }, [sheet자산Data]);

  // 추후 CRUD를 위한 스텁 (Stub for future CRUD)
  const saveAssetEntry = async (entry) => {
    console.log('saveAssetEntry stub', entry);
    return true;
  };

  const deleteAssetEntry = async (entry) => {
    console.log('deleteAssetEntry stub', entry);
    return true;
  };

  return (
    <AssetContext.Provider value={{
      sheet자산Data,
      assetNodes,
      defaultAssetCode,
      loading,
      loadSheet자산Data,
      saveAssetEntry,
      deleteAssetEntry
    }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetData = () => useContext(AssetContext);
