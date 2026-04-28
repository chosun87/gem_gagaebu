import { useState, useRef, useEffect, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Badge, Button, Calendar as PrimeCalendar, DataView, Dialog, Dropdown, InputSwitch, Message, Tag } from '@/assets/js/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import DialogList from '@/components/DialogList';
import LedgerSummary from '@/components/LedgerSummary';

// 한글 로케일 전역 설정 (언어만 바꿔도 달력이 한글로 렌더링 됨)
import { PrimeReact_locale } from '@/assets/js/PrimeReact';
addLocale('ko', PrimeReact_locale.ko.Calendar);
locale('ko');

export default function Calendar() {
  const { yearData, loading, selectedDate, setSelectedDate } = useData();
  const fcRef = useRef(null);

  const [showDialogList, setShowDialogList] = useState(false);
  const [dialogParams, setDialogParams] = useState({});

  useEffect(() => {
    if (fcRef.current && selectedDate) {
      const calendarApi = fcRef.current.getApi();
      // flushSync 에러 방지를 위해 비동기 처리 (타스크 큐로 위임)
      setTimeout(() => {
        calendarApi.gotoDate(selectedDate);
      }, 0);
    }
  }, [selectedDate]);

  // 일일 합계 데이터 가공
  const dailySummary = useMemo(() => {
    const summary = {};
    (yearData || []).forEach(item => {
      if (item.gDeleted) return;

      // 날짜 포맷 표준화 (YYYY-MM-DD)
      const dateStr = dayjs(item.gDate).format('YYYY-MM-DD');
      if (!summary[dateStr]) {
        summary[dateStr] = {
          income0: 0, expense0: 0, transfer0: 0, length0: 0,
          income1: 0, expense1: 0, transfer1: 0, length1: 0
        };
      }

      const amount = Number(item.gAmount) || 0;
      if (!item.gExecuted) {
        if (item.gType === '수입') { summary[dateStr].income0 += amount; ++summary[dateStr].length0; }
        else if (item.gType === '지출') { summary[dateStr].expense0 += amount; ++summary[dateStr].length0; }
        else if (item.gType === '이체') { summary[dateStr].transfer0 += amount; ++summary[dateStr].length0; }
      } else {
        if (item.gType === '수입') { summary[dateStr].income1 += amount; ++summary[dateStr].length1; }
        else if (item.gType === '지출') { summary[dateStr].expense1 += amount; ++summary[dateStr].length1; }
        else if (item.gType === '이체') { summary[dateStr].transfer1 += amount; ++summary[dateStr].length1; }
      }
      // console.log(dateStr, summary[dateStr]);
    });

    return summary;
  }, [yearData]);

  // 월별 합계 계산
  const monthTotal = useMemo(() => {
    const total = {
      income0: 0, expense0: 0, transfer0: 0,
      income1: 0, expense1: 0, transfer1: 0,
      incomeA: 0, expenseA: 0, transferA: 0
    };
    if (!selectedDate || !dailySummary) return total;

    const currentMonth = dayjs(selectedDate).format('YYYY-MM');
    Object.keys(dailySummary).forEach(dateStr => {
      if (dateStr.startsWith(currentMonth)) {
        total.income0 += dailySummary[dateStr].income0
        total.expense0 += dailySummary[dateStr].expense0;
        total.transfer0 += dailySummary[dateStr].transfer0;

        total.income1 += dailySummary[dateStr].income1;
        total.expense1 += dailySummary[dateStr].expense1;
        total.transfer1 += dailySummary[dateStr].transfer1;
      }
    });
    total.incomeA = total.income0 + total.income1;
    total.expenseA = total.expense0 + total.expense1;
    total.transferA = total.transfer0 + total.transfer1;

    return total;
  }, [selectedDate, dailySummary]);

  /*
  // yearData에서 현재 선택된 달의 데이터만 필터링 (방어 코드 포함)
  const currentMonthNum = selectedDate ? selectedDate.getMonth() + 1 : dayjs().month() + 1;

  const monthData = (yearData || []).filter(item => {
    if (!item?.gDate || typeof item.gDate !== 'string') return false;

    const dateParts = item.gDate.split(/[-./\s]+/);
    if (dateParts.length >= 2) {
      const rowMonthNum = parseInt(dateParts[1], 10);
      return rowMonthNum === currentMonthNum;
    }
    return false;
  });
  */

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  // 월 변경 (화살표 클릭 등)
  const handleMonthChange = (e) => {
    if (!e.year || !e.month) return;
    const newDate = new Date(e.year, e.month - 1, 1);
    setSelectedDate(newDate);
  }

  // yearNavigator, monthNavigator에 의한 월/연도 변경
  const handleViewDateChange = (e) => {
    if (e.value instanceof Date) {
      setSelectedDate(e.value);
    }
  }

  // 날짜 칸 클릭 처리
  const handleDateClick = (info) => {
    setDialogParams({ date: info.dateStr });
    setShowDialogList(true);
  };

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

  const formatCompactAmount = (amount) => {
    if (!amount) return '0';
    if (Math.abs(amount) >= 1000000) {
      return Math.trunc(amount / 10000).toLocaleString() + '만';
    }
    return amount.toLocaleString();
  };

  const templateDayCell = (arg) => {
    const day = arg.date.getDate();

    const argDate = dayjs(arg.date).format('YYYY-MM-DD');
    const data = dailySummary[argDate];
    if (data === undefined) {
      return (
        <div className="custom-day-content">
          <div className="day-number">
            {day}
          </div>
          <div className="daily-totals monospace text-xs"></div>
        </div >
      );
    } else {
      return (
        <div className="custom-day-content">
          <div className="day-number">
            {day}
            {(data?.income0 !== 0) && <i className={`fa-solid fa-star gType-수입`}></i>}
            {(data?.expense0 !== 0) && <i className={`fa-solid fa-star gType-지출`}></i>}
            {(data?.transfer0 !== 0) && <i className={`fa-solid fa-star gType-이체`}></i>}
            {data?.length0 > 0 && <span className="text-xs 실행전">{data?.length0}</span>}
          </div>
          <div className="daily-totals monospace text-xs">
            {/* {(data?.income1 || data?.expense1 || data?.transfer1) &&
              <> */}
            <div className="total-income">{formatCompactAmount(data?.income1)}</div>
            <div className="total-expense">{formatCompactAmount(data?.expense1)}</div>
            <div className="total-transfer">{formatCompactAmount(data?.transfer1)}</div>
            {/* </>
            } */}
          </div>
        </div >
      );
    }
  };

  return (
    <div className="panel-inner calendar-page">
      <PrimeCalendar className="month-calendar"
        inline
        locale="ko"
        yearNavigator yearNavigatorTemplate={templateYearNavigator}
        monthNavigator monthNavigatorTemplate={templateMonthNavigator}
        value={selectedDate}
        onMonthChange={handleMonthChange}
        onViewDateChange={handleViewDateChange}
      />

      <LedgerSummary symmary={monthTotal} />

      <div className="fc-swipe-wrapper"
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      >
        <FullCalendar
          ref={fcRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          expandRows={true}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          dayCellContent={templateDayCell}
          locale="ko"
          initialDate={selectedDate}
          dateClick={handleDateClick}
        />
      </div>

      <DialogList
        visible={showDialogList}
        onHide={() => setShowDialogList(false)}
        params={dialogParams}
      />
    </div>
  );
}
