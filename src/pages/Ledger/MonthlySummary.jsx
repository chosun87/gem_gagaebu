import { Chart as ChartJS, registerables } from 'chart.js';
import { useMemo, useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { useMonthSync } from '@/hooks/useMonthSync';
import { DataTable, Column } from '@/assets/js/PrimeReact';
import dayjs from 'dayjs';

import MonthNavigator from '@/components/MonthNavigator';
import MonthlySummaryChart from '@/components/MonthlySummaryChart';

const MONTH_LENGTH = 6;

ChartJS.register(...registerables);

export default function MonthlySummary({ monthLength = MONTH_LENGTH }) {
  const {
    sheetYYYYData,
    loadedSheetYYYY,
    loadSheet연도Data,
    selectedDate,
    categoryMap,
  } = useData();
  const fetchingYears = useRef(new Set());

  // 데이터 가공 ---------------------------------------------------------------------------------------
  const months = useMemo(() => {
    const arr = [];
    for (let i = monthLength - 1; i >= 0; i--) {
      arr.push(dayjs(selectedDate).subtract(i, 'month').format('YYYY-MM'));
    }
    return arr;
  }, [selectedDate, monthLength]);

  const requiredYears = useMemo(() => {
    const years = new Set();
    months.forEach((m) => years.add(m.split('-')[0]));
    return Array.from(years);
  }, [months]);

  const summaryData = useMemo(() => {
    const rawData = {};
    months.forEach((m) => {
      rawData[m] = { month: m, 수입: 0, 지출: 0, 이체: 0 };
    });

    const allData = [];
    requiredYears.forEach((year) => {
      if (sheetYYYYData[year]) {
        allData.push(...sheetYYYYData[year]);
      }
    });

    allData.forEach((item) => {
      if (item.gDeleted) return;

      // 합계 제외 카테고리 체크
      const catInfo = categoryMap[item.gCategory];
      if (catInfo && catInfo.cdAddSum === false) return;

      const m = dayjs(item.gDate).format('YYYY-MM');
      if (rawData[m]) {
        rawData[m][item.gType] += item.gAmount;
      }
    });

    // DataTable용 리스트 (최신순)
    const tableData = [...months].reverse().map((m) => ({
      monthLabel: dayjs(m).format('YYYY-MM'),
      ...rawData[m],
    }));

    return { months, tableData, rawData };
  }, [sheetYYYYData, months, requiredYears, categoryMap]);

  useEffect(() => {
    requiredYears.forEach((year) => {
      if (!loadedSheetYYYY[year] && !fetchingYears.current.has(year)) {
        fetchingYears.current.add(year);
        loadSheet연도Data(year).finally(() => {
          fetchingYears.current.delete(year);
        });
      }
    });
  }, [requiredYears, loadedSheetYYYY, loadSheet연도Data]);

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const { handleMonthChange, handleViewDateChange } = useMonthSync(
    '/ledger/monthlySummary',
  );

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateAmountBody = (rowData, field) => {
    return <>{(rowData[field] || 0).toLocaleString()}</>;
  };

  return (
    <div className="panel-content summary-page">
      <MonthNavigator
        selectedDate={selectedDate}
        onMonthChange={handleMonthChange}
        onViewDateChange={handleViewDateChange}
      />

      <section className="panel-body">
        <h3 className="text-center">
          최근 {summaryData.months.length}개월 비교
        </h3>

        <MonthlySummaryChart
          months={summaryData.months}
          rawData={summaryData.rawData}
        />

        <div className="summary-table-container">
          {/* <h3 className="text-center mb-3">최근 3개월 합계</h3> */}
          <DataTable
            stripedRows
            responsiveLayout="scroll"
            value={summaryData.tableData}
          >
            <Column
              field="monthLabel"
              header="연월"
              bodyClassName="px-0 font-bold"
              style={{ width: '10%', minWidth: '5rem' }}
            />
            <Column
              field="수입"
              header="수입"
              alignHeader="center"
              align="right"
              bodyClassName="px-0 monospace gType-수입"
              body={(rowData) => templateAmountBody(rowData, '수입')}
              style={{ width: '30%' }}
            />
            <Column
              field="지출"
              header="지출"
              alignHeader="center"
              align="right"
              bodyClassName="px-0 monospace gType-지출"
              body={(rowData) => templateAmountBody(rowData, '지출')}
              style={{ width: '30%' }}
            />
            <Column
              field="이체"
              header="이체"
              alignHeader="center"
              align="right"
              bodyClassName="px-0 monospace gType-이체"
              body={(rowData) => templateAmountBody(rowData, '이체')}
              style={{ width: '30%' }}
            />
          </DataTable>
        </div>
      </section>
    </div>
  );
}
