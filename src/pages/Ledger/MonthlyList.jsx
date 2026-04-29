import { useState, useRef, lazy, Suspense } from 'react';
import { useData } from '@/context/DataContext';
import { useMonthSync } from '@/hooks/useMonthSync';
import { useSwipe } from '@/hooks/useSwipe';
import { Badge, Calendar as PrimeCalendar, DataView, Dropdown, InputSwitch, Message, SpeedDial, Tooltip, ProgressSpinner } from '@/assets/js/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

const DialogLedger = lazy(() => import('@/components/DialogLedger'));
const DialogAI = lazy(() => import('@/components/DialogAI'));

// 한글 로케일 전역 설정 (언어만 바꿔도 달력이 한글로 렌더링 됨)
import { PrimeReact_locale } from '@/assets/js/PrimeReact';

addLocale('ko', PrimeReact_locale.ko.Calendar);
locale('ko');

export default function MonthlyList() {
  const { yearData, loading, selectedDate, handleChange_gExecute } = useData();
  const { handleMonthChange, handleViewDateChange, moveMonth } = useMonthSync('/ledger/monthlyList');
  const [ledger, setLedger] = useState(null);
  const [showDialogLedger, setShowDialogLedger] = useState(false);
  const [showDialogAI, setShowDialogAI] = useState(false);

  const speedDialItems = [
    {
      label: 'AI로 입력',
      icon: 'pi pi-plus',
      className: 'icon-gemini',
      tooltip: 'AI로 입력', tooltipOptions: { position: 'left' },
      command: () => {
        setShowDialogAI(true);
      }
    },
    {
      label: '입력 폼으로 추가',
      icon: 'pi pi-pencil',
      tooltip: '입력 폼으로 추가', tooltipOptions: { position: 'left' },
      command: () => fnOpenDialogLedger(null)
    }
  ];

  // yearData에서 현재 선택된 달의 데이터만 필터링
  const currentMonthNum = selectedDate.getMonth() + 1;
  const monthData = yearData.filter(item => {
    const dateParts = item.gDate.split(/[-./\s]+/);
    if (dateParts.length >= 2) {
      const rowMonthNum = parseInt(dateParts[1], 10);
      return rowMonthNum === currentMonthNum;
    }
    return false;
  });

  const fnOpenDialogLedger = (ledger) => {
    setLedger(ledger);
    setShowDialogLedger(true);
  }

  const fnHideDialogLedger = () => {
    setShowDialogLedger(false);
  }

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => moveMonth(1),
    onSwipeRight: () => moveMonth(-1)
  });

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  // Calendar 월 선택 템플릿
  const templateMonthNavigator = (e) => {
    return (
      <Dropdown
        className="month-dropdown"
        value={e.value}
        options={e.options}
        onChange={(event) => e.onChange(event.originalEvent, event.value)}
      />
    );
  };
  // Calendar 연도 선택 템플릿
  const templateYearNavigator = (e) => {
    return (
      <Dropdown
        className="year-dropdown"
        value={e.value}
        options={e.options}
        onChange={(event) => e.onChange(event.originalEvent, event.value)}
      />
    );
  };

  // 아이템 템플릿 (DialogList.jsx의 템플릿과 동일하게 구성)
  const templateDateViewItem = (item) => {
    const gTypeClass = `gType-${item.gType}`;
    const gExecutedClass = `gExecuted-${(item.gExecuted) ? 'Y' : 'N'}`;

    return (
      <div
        className={`list-item ${gTypeClass} ${gExecutedClass} col-12`}
        onClick={() => fnOpenDialogLedger(item)}
      >
        <Badge
          className={`gType-${item.gType} text-base`}
          value={item.gCategory}
        />

        <div className="flex-grow-1 flex flex-column gap-1">
          <div className="flex align-items-center column-gap-2">
            <span className="gDate text-lg font-semibold">{dayjs(item.gDate).format('DD일')}</span>
            <span className="gMemo">{item.gMemo}</span>
          </div>
          <div className="flex align-items-center gap-1">
            <span className="gAcc">{item.gAcc2 ? `${item.gAcc1} → ${item.gAcc2}` : item.gAcc1}</span>
          </div>
        </div>

        <div className="gAmount monospace text-right font-bold text-lg">
          {(item?.gAmount || 0).toLocaleString()}<span className="unit text-xs">원</span>
        </div>

        <InputSwitch checked={item.gExecuted} trueValue={false} falseValue={true}
          tooltip="실행" tooltipOptions={{ position: 'top' }}
          onChange={(e) => handleChange_gExecute(item, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  return (
    <>
      <div className="panel-inner list-page">
        <PrimeCalendar className="month-calendar"
          inline
          locale="ko"
          yearNavigator yearNavigatorTemplate={templateYearNavigator}
          monthNavigator monthNavigatorTemplate={templateMonthNavigator}
          value={selectedDate}
          onMonthChange={handleMonthChange}
          onViewDateChange={handleViewDateChange}
        />

        {/* <div className="list-swipe-wrapper flex flex-column flex-grow-1 overflow-hidden"
            {...swipeHandlers}
          > */}
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
            className="list-dataview"
            value={monthData}
            itemTemplate={templateDateViewItem}
          />
        )}
        {/* </div> */}
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
