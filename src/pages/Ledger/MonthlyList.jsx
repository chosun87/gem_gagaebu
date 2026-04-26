import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { Badge, Button, Calendar as PrimeCalendar, DataView, Dialog, Dropdown, InputSwitch, Message, Tag } from '@/assets/js/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import DialogLedger from '@/components/DialogLedger';

// 한글 로케일 전역 설정 (언어만 바꿔도 달력이 한글로 렌더링 됨)
import { PrimeReact_locale } from '@/assets/js/PrimeReact';
addLocale('ko', PrimeReact_locale.ko.Calendar);
locale('ko');

export default function MonthlyList() {
  const { yearData, loading, selectedDate, setSelectedDate, handleChange_gExecute } = useData();
  const [ledger, setLedger] = useState(null);
  const [showDialogLedger, setShowDialogLedger] = useState(false);

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
  // 월 변경
  const handleMonthChange = (e) => {
    console.log(e);
    const newDate = new Date(e.year, e.month - 1, 1);
    setSelectedDate(newDate);
  }

  // yearNavigator monthNavigator에 의한 월 변경
  const handleViewDateChange = (e) => {
    setSelectedDate(e.value);
  }

  // Calendar 월 선택 템플릿
  // 스와이프 핸들러 추가
  const touchStart = useRef(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // 왼쪽으로 스와이프 -> 다음 달
        setSelectedDate(dayjs(selectedDate).add(1, 'month').toDate());
      } else {
        // 오른쪽으로 스와이프 -> 이전 달
        setSelectedDate(dayjs(selectedDate).subtract(1, 'month').toDate());
      }
    }
    touchStart.current = null;
  };

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
          {item.gAmount.toLocaleString()}<span className="unit text-xs">원</span>
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
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          > */}
        {loading ? (
          <div className="flex align-items-center justify-content-center h-full p-5">
            <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
            <p>데이터를 불러오는 중입니다...</p>
          </div>
        ) : monthData.length === 0 ? (
          <div className="flex align-items-center justify-content-center h-full text-500 p-5">
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

      {/* Floating Action Button */}
      < Button
        className="btn-floating-action btn-add-item shadow-7"
        severity="secondary" size="large" rounded
        icon="pi pi-plus"
        onClick={() => fnOpenDialogLedger(null)
        }
        tooltip="목록 추가" tooltipOptions={{ position: 'top' }}
      />

      {/* 가계부 입력 폼 다이얼로그 */}
      <DialogLedger
        ledger={ledger}
        visible={showDialogLedger}
        onHide={fnHideDialogLedger}
      />
    </>
  );
}
