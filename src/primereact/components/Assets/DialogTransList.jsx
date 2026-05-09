import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import {
  Sidebar,
  Panel,
  DataView,
  Button,
  Message,
  ProgressSpinner,
} from '@/assets/js/PrimeReact';
import { useData } from '@/context/DataContext';
import { TRANSACTION_TYPE } from '@/assets/js/constants';
import dayjs from 'dayjs';
import AssetTransListItem from '@/components/Assets/AssetTransListItem';
import AssetSummary from '@/components/Assets/AssetSummary';

const DialogLedger = lazy(() => import('@/components/Ledger/DialogLedger'));
const DialogAI = lazy(() => import('@/components/Ledger/DialogAI'));

export default function DialogList({ visible, onHide, params }) {
  const {
    yearData,
    sheetYYYYData,
    loadSheet연도Data,
    loadedSheetYYYY,
    updateLedgerEntry_gExecute,
    loading: dataLoading,
  } = useData();
  const [ledger, setLedger] = useState(null);
  const [showDialogLedger, setShowDialogLedger] = useState(false);
  const [showDialogAI, setShowDialogAI] = useState(false);

  // 파라미터 기반 필터링 로직
  const filteredData = useMemo(() => {
    if (!params) return [];

    const baseData = params.accCode
      ? Object.values(sheetYYYYData || {}).flat()
      : yearData;

    return baseData
      .filter((item) => {
        // 이체만 처리
        if (item.gType !== TRANSACTION_TYPE.TRANSFER) return false;

        // 자산 조건 (accCode)
        if (
          params.accCode &&
          item.gAcc1 !== params.accCode &&
          item.gAcc2 !== params.accCode
        )
          return false;

        return true;
      })
      .sort((a, b) => dayjs(b.gDate).unix() - dayjs(a.gDate).unix());
  }, [yearData, sheetYYYYData, params]);

  // 헤더에 출력할 조건 텍스트 생성
  const headerText = useMemo(() => {
    if (!params) return '조회 내역';
    const parts = [];
    if (params.accCode) parts.push(params.header);
    return parts.length === 1
      ? parts[0]
      : params.accCode
        ? params.header
        : '조회 내역';
  }, [params]);

  // 필터링된 데이터의 합계 계산
  const listTotal = useMemo(() => {
    const total = {
      deposit0: 0,
      widhdraw0: 0,
      deposit1: 0,
      widhdraw1: 0,
      depositA: 0,
      widhdrawA: 0,
    };

    filteredData.forEach((item) => {
      const amount = Number(item.gAmount) || 0;

      if (!item.gExecuted) {
        if (amount >= 0) {
          if (item.gAcc2 === params.accCode) total.deposit0 += amount;
          else if (item.gAcc1 === params.accCode) total.widhdraw0 += amount;
        } else {
          if (item.gAcc1 === params.accCode) total.deposit0 += -amount;
          else if (item.gAcc2 === params.accCode) total.widhdraw0 += -amount;
        }
      } else {
        if (amount >= 0) {
          if (item.gAcc2 === params.accCode) total.deposit1 += amount;
          else if (item.gAcc1 === params.accCode) total.widhdraw1 += amount;
        } else {
          if (item.gAcc1 === params.accCode) total.deposit1 += -amount;
          else if (item.gAcc2 === params.accCode) total.widhdraw1 += -amount;
        }
      }
    });

    total.depositA = total.deposit0 + total.deposit1;
    total.widhdrawA = total.widhdraw0 + total.widhdraw1;

    return total;
  }, [filteredData, params.accCode]);

  // 반복 내역 전체 조회를 위한 연도별 데이터 로드
  useEffect(() => {
    if (
      visible &&
      params?.startYear &&
      params?.endYear &&
      params?.startYear !== params?.endYear
    ) {
      for (let y = params.startYear; y <= params.endYear; y++) {
        const yearStr = y.toString();
        if (!loadedSheetYYYY[yearStr]) {
          loadSheet연도Data(yearStr);
        }
      }
    }
  }, [
    visible,
    params?.startYear,
    params?.endYear,
    loadedSheetYYYY,
    loadSheet연도Data,
  ]);

  // Functions -------------------------------------------------------------------------------------
  const fnOpenDialogLedger = (ledger) => {
    setLedger(ledger);
    setShowDialogLedger(true);
  };

  const fnHideDialogLedger = () => {
    setShowDialogLedger(false);
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateDataViewItem = (item) => (
    <AssetTransListItem
      accCode={params.accCode}
      item={item}
      onClick={() => fnOpenDialogLedger(item)}
      onExecuteChange={updateLedgerEntry_gExecute}
    />
  );

  const templateFooter = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary"
          size="large"
          outlined
          label="닫기"
          onClick={onHide}
          disabled={dataLoading}
        />
        <Button
          severity="secondary"
          size="large"
          label="추가"
          icon={dataLoading ? 'pi pi-spin pi-spinner' : 'pi pi-plus'}
          onClick={() => fnOpenDialogLedger(null)}
          disabled={dataLoading}
        />
        <Button
          severity="secondary"
          size="large"
          className="icon-gemini"
          tooltip="AI로 입력"
          tooltipOptions={{ position: 'top' }}
          icon={dataLoading ? 'pi pi-spin pi-spinner' : 'pi pi-plus'}
          onClick={() => setShowDialogAI(true)}
          disabled={dataLoading}
        />
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-list shadow-7"
      header={<h3 className="dialog-title text-2xl">{headerText}</h3>}
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel footerTemplate={templateFooter}>
        <AssetSummary summary={listTotal} />

        <div className="asset-page list-page">
          {dataLoading ? (
            <div className="full-page">
              <ProgressSpinner />
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="full-page text-500">
              <Message severity="warn" text="해당 조건의 내역이 없습니다." />
            </div>
          ) : (
            <DataView
              className="list-dataview"
              value={filteredData}
              itemTemplate={templateDataViewItem}
            />
          )}
        </div>
      </Panel>

      {/* 내역 수정용 다이얼로그 */}
      <Suspense fallback={null}>
        <DialogLedger
          ledger={ledger}
          params={params}
          visible={showDialogLedger}
          onHide={fnHideDialogLedger}
        />
      </Suspense>
      <Suspense fallback={null}>
        <DialogAI
          visible={showDialogAI}
          onHide={() => setShowDialogAI(false)}
        />
      </Suspense>
    </Sidebar>
  );
}
