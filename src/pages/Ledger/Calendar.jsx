import { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react';
import { useData } from '@/context/DataContext';
import { useMonthSync } from '@/hooks/useMonthSync';
import { useSwipe } from '@/hooks/useSwipe';
import dayjs from 'dayjs';

import MonthNavigator from '@/components/MonthNavigator';
import LedgerSummary from '@/components/LedgerSummary';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const DialogList = lazy(() => import('@/components/DialogList'));

export default function Calendar() {
  const { yearData, selectedDate, categoryMap } = useData();
  const [showDialogList, setShowDialogList] = useState(false);
  const [dialogParams, setDialogParams] = useState({});
  const fcRef = useRef(null);

  // 일일 합계 데이터 가공
  const dailySummary = useMemo(() => {
    const summary = {};
    (yearData || []).forEach((item) => {
      if (item.gDeleted) return;

      // 합계 제외 카테고리 체크
      const catInfo = categoryMap[item.gCategory];
      if (catInfo && catInfo.cdAddSum === false) return;

      // 날짜 포맷 표준화 (YYYY-MM-DD)
      const dateStr = dayjs(item.gDate).format('YYYY-MM-DD');
      if (!summary[dateStr]) {
        summary[dateStr] = {
          income0: 0,
          expense0: 0,
          transfer0: 0,
          length0: 0,
          income1: 0,
          expense1: 0,
          transfer1: 0,
          length1: 0,
        };
      }

      const amount = Number(item.gAmount) || 0;
      if (!item.gExecuted) {
        if (item.gType === '수입') {
          summary[dateStr].income0 += amount;
          ++summary[dateStr].length0;
        } else if (item.gType === '지출') {
          summary[dateStr].expense0 += amount;
          ++summary[dateStr].length0;
        } else if (item.gType === '이체') {
          summary[dateStr].transfer0 += amount;
          ++summary[dateStr].length0;
        }
      } else {
        if (item.gType === '수입') {
          summary[dateStr].income1 += amount;
          ++summary[dateStr].length1;
        } else if (item.gType === '지출') {
          summary[dateStr].expense1 += amount;
          ++summary[dateStr].length1;
        } else if (item.gType === '이체') {
          summary[dateStr].transfer1 += amount;
          ++summary[dateStr].length1;
        }
      }
    });

    return summary;
  }, [yearData, categoryMap]);

  // 월별 합계 계산
  const monthTotal = useMemo(() => {
    const total = {
      income0: 0,
      expense0: 0,
      transfer0: 0,
      income1: 0,
      expense1: 0,
      transfer1: 0,
      incomeA: 0,
      expenseA: 0,
      transferA: 0,
    };
    if (!selectedDate || !dailySummary) return total;

    const currentMonth = dayjs(selectedDate).format('YYYY-MM');
    Object.keys(dailySummary).forEach((dateStr) => {
      if (dateStr.startsWith(currentMonth)) {
        total.income0 += dailySummary[dateStr].income0;
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

  useEffect(() => {
    if (fcRef.current && selectedDate) {
      const calendarApi = fcRef.current.getApi();
      // flushSync 에러 방지를 위해 비동기 처리 (타스크 큐로 위임)
      setTimeout(() => {
        calendarApi.gotoDate(selectedDate);
      }, 0);
    }
  }, [selectedDate]);

  // Functions -------------------------------------------------------------------------------------
  const formatCompactAmount = (amount) => {
    if (!amount) return '0';
    if (Math.abs(amount) >= 1000000) {
      return Math.trunc(amount / 10000).toLocaleString() + '만';
    }
    return amount.toLocaleString();
  };

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const { handleMonthChange, handleViewDateChange, moveMonth } =
    useMonthSync('/ledger/calendar');

  // 날짜 칸 클릭 처리
  const handleDateClick = (info) => {
    setDialogParams({ date: info.dateStr });
    setShowDialogList(true);
  };

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => moveMonth(1),
    onSwipeRight: () => moveMonth(-1),
  });

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------

  const templateDayCell = (arg) => {
    const day = arg.date.getDate();

    const argDate = dayjs(arg.date).format('YYYY-MM-DD');
    const data = dailySummary[argDate];
    if (data === undefined) {
      return (
        <div className="custom-day-content">
          <div className="day-number">{day}</div>
          <div className="daily-totals monospace text-xs"></div>
        </div>
      );
    } else {
      return (
        <div className="custom-day-content">
          <div className="day-number">
            {day}
            {data?.income0 !== 0 && (
              <i className={`fa-solid fa-star gType-수입`}></i>
            )}
            {data?.expense0 !== 0 && (
              <i className={`fa-solid fa-star gType-지출`}></i>
            )}
            {data?.transfer0 !== 0 && (
              <i className={`fa-solid fa-star gType-이체`}></i>
            )}
            {data?.length0 > 0 && (
              <span className="text-xs 실행전">{data?.length0}</span>
            )}
          </div>
          <div className="daily-totals monospace text-xs">
            {/* {(data?.income1 || data?.expense1 || data?.transfer1) &&
              <> */}
            <div className="total-income">
              {formatCompactAmount(data?.income1)}
            </div>
            <div className="total-expense">
              {formatCompactAmount(data?.expense1)}
            </div>
            <div className="total-transfer">
              {formatCompactAmount(data?.transfer1)}
            </div>
            {/* </>
            } */}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="panel-content calendar-page">
      <MonthNavigator
        selectedDate={selectedDate}
        onMonthChange={handleMonthChange}
        onViewDateChange={handleViewDateChange}
      />

      <LedgerSummary summary={monthTotal} />

      <div className="fc-swipe-wrapper" {...swipeHandlers}>
        <FullCalendar
          ref={fcRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          expandRows={true}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          dayCellContent={templateDayCell}
          locale="ko"
          initialDate={selectedDate}
          dateClick={handleDateClick}
        />
      </div>

      <Suspense fallback={null}>
        <DialogList
          visible={showDialogList}
          onHide={() => setShowDialogList(false)}
          params={dialogParams}
        />
      </Suspense>
    </div>
  );
}
