import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Dropdown, Calendar as PrimeCalendar, DataTable, Column } from '@/assets/js/PrimeReact';
import dayjs from 'dayjs';
import MonthlySummaryChart from '@/components/MonthlySummaryChart';

const MONTH_LENGTH = 6;

export default function MonthlySummary({ monthLength = MONTH_LENGTH }) {
  const { yearData } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 데이터 가공 ---------------------------------------------------------------------------------------
  const summaryData = useMemo(() => {
    const months = [];
    // 선택된 달을 포함한 최근 3개월 계산
    for (let i = monthLength + 1; i >= 0; i--) {
      months.push(dayjs(selectedDate).subtract(i, 'month').format('YYYY-MM'));
    }

    const rawData = {};
    months.forEach(m => {
      rawData[m] = { month: m, 수입: 0, 지출: 0, 이체: 0 };
    });

    (yearData || []).forEach(item => {
      if (item.gDeleted) return;
      const m = dayjs(item.gDate).format('YYYY-MM');
      if (rawData[m]) {
        rawData[m][item.gType] += item.gAmount;
      }
    });

    // DataTable용 리스트 (최신순)
    const tableData = [...months].reverse().map(m => ({
      monthLabel: dayjs(m).format('YYYY-MM'),
      ...rawData[m]
    }));

    return { months, tableData, rawData };
  }, [yearData, selectedDate]);

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  // 월 변경
  const handleMonthChange = (e) => {
    const newDate = new Date(e.year, e.month - 1, 1);
    setSelectedDate(newDate);
  }

  // yearNavigator monthNavigator에 의한 월 변경
  const handleViewDateChange = (e) => {
    setSelectedDate(e.value);
  }

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  // 금액 포맷팅 템플릿
  const amountBodyTemplate = (rowData, field) => {
    return <>{(rowData[field] || 0).toLocaleString()}</>;
  };

  // Calendar 월 선택 템플릿
  const templateMonthNavigator = (e) => (
    <Dropdown className="month-dropdown" value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} />
  );
  const templateYearNavigator = (e) => (
    <Dropdown className="year-dropdown" value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} />
  );

  return (
    <div className="panel-inner summary-page">
      <PrimeCalendar className="month-calendar"
        inline
        locale="ko"
        yearNavigator yearNavigatorTemplate={templateYearNavigator}
        monthNavigator monthNavigatorTemplate={templateMonthNavigator}
        value={selectedDate}
        onMonthChange={handleMonthChange}
        onViewDateChange={handleViewDateChange}
      />

      <section className="panel-body">
        <h3 className="text-center">최근 {summaryData.months.length}개월 비교</h3>

        <MonthlySummaryChart
          months={summaryData.months}
          rawData={summaryData.rawData}
        />

        <div className="summary-table-container">
          {/* <h3 className="text-center mb-3">최근 3개월 합계</h3> */}
          <DataTable
            stripedRows responsiveLayout="scroll"
            value={summaryData.tableData}
          >
            <Column field="monthLabel" header="연월"
              bodyClassName="px-0 font-bold"
              style={{ width: '10%', minWidth: '5rem' }}
            />
            <Column field="수입" header="수입"
              alignHeader="center" align="right"
              bodyClassName="px-0 monospace gType-수입"
              body={(data) => amountBodyTemplate(data, '수입')}
              style={{ width: '30%' }}
            />
            <Column field="지출" header="지출"
              alignHeader="center" align="right"
              bodyClassName="px-0 monospace gType-지출"
              body={(data) => amountBodyTemplate(data, '지출')}
              style={{ width: '30%' }}
            />
            <Column field="이체" header="이체"
              alignHeader="center" align="right"
              bodyClassName="px-0 monospace gType-이체"
              body={(data) => amountBodyTemplate(data, '이체')}
              style={{ width: '30%' }}
            />
          </DataTable>
        </div>
      </section>
    </div>
  );
}
