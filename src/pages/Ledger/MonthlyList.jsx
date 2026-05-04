import { useState, lazy, Suspense, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { useMonthSync } from '@/hooks/useMonthSync';
import {
  DataView,
  Message,
  SpeedDial,
  Tooltip,
  ProgressSpinner,
} from '@/assets/js/PrimeReact';

import MonthNavigator from '@/components/MonthNavigator';
import LedgerListItem from '@/components/common/LedgerListItem';

const DialogLedger = lazy(() => import('@/components/DialogLedger'));
const DialogAI = lazy(() => import('@/components/DialogAI'));

export default function MonthlyList() {
  const { yearData, loading, selectedDate, updateLedgerEntry_gExecute } =
    useData();
  const [ledger, setLedger] = useState(null);
  const [showDialogLedger, setShowDialogLedger] = useState(false);
  const [showDialogAI, setShowDialogAI] = useState(false);

  const speedDialItems = [
    {
      label: 'AI로 입력',
      icon: 'pi pi-plus',
      className: 'icon-gemini',
      tooltip: 'AI로 입력',
      tooltipOptions: { position: 'left' },
      command: () => {
        setShowDialogAI(true);
      },
    },
    {
      label: '입력 폼으로 추가',
      icon: 'pi pi-pencil',
      tooltip: '입력 폼으로 추가',
      tooltipOptions: { position: 'left' },
      command: () => fnOpenDialogLedger(null),
    },
  ];

  // yearData에서 현재 선택된 달의 데이터만 필터링
  const monthData = useMemo(() => {
    const currentMonthNum = selectedDate.getMonth() + 1;
    return yearData.filter((item) => {
      const dateParts = item.gDate.split(/[-./\s]+/);
      if (dateParts.length >= 2) {
        const rowMonthNum = parseInt(dateParts[1], 10);
        return rowMonthNum === currentMonthNum;
      }
      return false;
    });
  }, [yearData, selectedDate]);

  // Functions -------------------------------------------------------------------------------------
  const fnOpenDialogLedger = (ledger) => {
    setLedger(ledger);
    setShowDialogLedger(true);
  };

  const fnHideDialogLedger = () => {
    setShowDialogLedger(false);
  };

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const { handleMonthChange, handleViewDateChange } = useMonthSync(
    '/ledger/monthlyList',
  );

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateDateViewItem = (item) => (
    <LedgerListItem
      item={item}
      dateFormat="DD일"
      onClick={() => fnOpenDialogLedger(item)}
      onExecuteChange={updateLedgerEntry_gExecute}
    />
  );


  return (
    <>
      <div className="panel-content list-page">
        <MonthNavigator
          selectedDate={selectedDate}
          onMonthChange={handleMonthChange}
          onViewDateChange={handleViewDateChange}
        />

        {loading ? (
          <div className="full-page">
            <ProgressSpinner />
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : monthData.length === 0 ? (
          <div className="full-page text-500">
            <Message severity="warn" text="이번 달 내역이 없습니다." />
          </div>
        ) : (
          <DataView
            className="list-dataview with-btn-floating-action"
            value={monthData}
            itemTemplate={templateDateViewItem}
          />
        )}
      </div>

      {/* Floating Action Button -> SpeedDial */}
      <Tooltip target=".p-speeddial-action" position="left" />
      <SpeedDial
        direction="up"
        className="btn-floating-action"
        buttonClassName="p-button-secondary shadow-7"
        showIcon="pi pi-plus"
        hideIcon="pi pi-times"
        model={speedDialItems}
      />

      {/* 가계부 입력 폼 다이얼로그 */}
      <Suspense fallback={null}>
        <DialogLedger
          ledger={ledger}
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
    </>
  );
}
