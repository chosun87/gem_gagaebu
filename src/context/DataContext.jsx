import { createContext, useContext } from 'react';
import { CodeProvider, useCodeData } from './DataContext코드';
import { AssetProvider, useAssetData } from './DataContext자산';
import { RepeatProvider, useRepeatData } from './DataContext반복';
import { YYYYProvider, useYYYYData } from './DataContextYYYY';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  return (
    <CodeProvider>
      <AssetProvider>
        <RepeatProvider>
          <YYYYProvider>
            {children}
          </YYYYProvider>
        </RepeatProvider>
      </AssetProvider>
    </CodeProvider>
  );
};

export const useData = () => {
  const code = useCodeData();
  const asset = useAssetData();
  const repeat = useRepeatData();
  const yyyy = useYYYYData();

  // 모든 컨텍스트의 데이터를 하나로 합쳐서 반환 (기존 호환성 유지)
  return {
    // 코드 데이터
    periodOptions: code.periodOptions,
    categoryOptions: code.categoryOptions,
    loadSheet코드Data: code.loadSheet코드Data,
    saveCodeEntry: code.saveCodeEntry,
    deleteCodeEntry: code.deleteCodeEntry,

    // 자산 데이터
    sheet자산Data: asset.sheet자산Data,
    assetNodes: asset.assetNodes,
    defaultAssetCode: asset.defaultAssetCode,
    loadSheet자산Data: asset.loadSheet자산Data,
    saveAssetEntry: asset.saveAssetEntry,
    deleteAssetEntry: asset.deleteAssetEntry,

    // 반복 데이터
    sheet반복Data: repeat.sheet반복Data,
    loadSheet반복Data: repeat.loadSheet반복Data,
    handleChange_rpComplete: repeat.handleChange_rpComplete,
    saveRepeatEntry: repeat.saveRepeatEntry,
    deleteRepeatEntry: repeat.deleteRepeatEntry,

    // 연도별 가계부 데이터
    sheetYYYYData: yyyy.sheetYYYYData,
    loadedSheetYYYY: yyyy.loadedSheetYYYY,
    yearData: yyyy.yearData,
    selectedDate: yyyy.selectedDate,
    setSelectedDate: yyyy.setSelectedDate,
    loadSheet연도Data: yyyy.loadSheet연도Data,
    handleChange_gExecute: yyyy.handleChange_gExecute,
    saveLedgerEntry: yyyy.saveLedgerEntry,
    generateLedgerFromRepeat: yyyy.generateLedgerFromRepeat,
    deleteLedgerEntry: yyyy.deleteLedgerEntry,

    // 로딩 상태 통합
    loading: code.loading || asset.loading || repeat.loading || yyyy.loading
  };
};
