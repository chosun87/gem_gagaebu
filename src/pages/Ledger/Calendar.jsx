import { useState, useRef, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Badge, Button, Calendar as PrimeCalendar, DataView, Dialog, Dropdown, InputSwitch, Message, Tag } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

// 한글 로케일 전역 설정 (언어만 바꿔도 달력이 한글로 렌더링 됨)
import { PrimeReact_locale } from '@/components/PrimeReact';
addLocale('ko', PrimeReact_locale.ko.Calendar);
locale('ko');

export default function Calendar() {
  const { yearData, loading, selectedDate, setSelectedDate } = useData();
  const fcRef = useRef(null);
  const events = [];

  useEffect(() => {
    if (fcRef.current && selectedDate) {
      const calendarApi = fcRef.current.getApi();
      // flushSync 에러 방지를 위해 비동기 처리 (타스크 큐로 위임)
      setTimeout(() => {
        calendarApi.gotoDate(selectedDate);
      }, 0);
    }
  }, [selectedDate]);

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

  const handleDateClick = (info) => {
    console.log('Date clicked:', info.dateStr);
  };

  const handleEventClick = (info) => {
    console.log('Event clicked:', info.event.title);
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

  const templateDayCell = (arg) => {
    const day = arg.date.getDate();

    // 예산 데이터가 있는 경우 해당 날짜에 표시
    const eventData = events.find(e => e.date === arg.dateStr);

    return (
      <div className="custom-day-content">
        <div className="day-number">{day}</div>
        {eventData && (
          <div className="event-dot" />
        )}
      </div>
    );
  };

  return (
    <div className="panel-inner calendar-page">
      <PrimeCalendar className="month-calendar padding-bottom-20"
        inline
        locale="ko"
        yearNavigator yearNavigatorTemplate={templateYearNavigator}
        monthNavigator monthNavigatorTemplate={templateMonthNavigator}
        value={selectedDate}
        onMonthChange={handleMonthChange}
        onViewDateChange={handleViewDateChange}
      />

      <FullCalendar
        ref={fcRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
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
  );
}
