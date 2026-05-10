import { Chart as ChartJS, registerables } from 'chart.js';
import { useMemo, useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { useMonthSync } from '@/hooks/useMonthSync';
import { DataTable, Column } from '@/assets/js/PrimeReact';
import dayjs from 'dayjs';
import { TRANSACTION_TYPE } from '@/assets/js/constants';

import MonthNavigator from '@/components/common/MonthNavigator';
import MonthlySummaryChart from '@/components/Assets/MonthlySummaryChart';
import { getSignedAmount } from '@/assets/js/dataUtils';

const MONTH_LENGTH = 6;

ChartJS.register(...registerables);

export default function AssetsMonthlySummary({ monthLength = MONTH_LENGTH }) {
  const { sheetYYYYData, loadedSheetYYYY, loadSheet연도Data, selectedDate } =
    useData();
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
      rawData[m] = {
        month: m,
        [TRANSACTION_TYPE.DEPOSIT]: 0,
        [TRANSACTION_TYPE.WITHDRAW]: 0,
        [TRANSACTION_TYPE.REVENUE]: 0,
      };
    });

    const allData = [];
    requiredYears.forEach((year) => {
      if (sheetYYYYData[year]) {
        allData.push(...sheetYYYYData[year]);
      }
    });

    allData.forEach((item) => {
      if (item.gDeleted || item.gType !== TRANSACTION_TYPE.TRANSFER) return;

      const m = dayjs(item.gDate).format('YYYY-MM');
      if (rawData[m]) {
        const val1 = getSignedAmount(item, item.gAcc1);
        if (val1.trType) rawData[m][val1.trType] += val1.trAmount;

        if (item.gCategory === '저축') {
          const val2 = getSignedAmount(item, item.gAcc2);
          if (val2.trType) rawData[m][val2.trType] += val2.trAmount;
        }
      }
    });

    // DataTable용 리스트 (최신순)
    const tableData = [...months].reverse().map((m) => ({
      monthLabel: dayjs(m).format('YYYY-MM'),
      ...rawData[m],
    }));

    return { months, tableData, rawData };
  }, [sheetYYYYData, months, requiredYears]);

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
    '/assets/monthlySummary',
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
              field={TRANSACTION_TYPE.DEPOSIT}
              header={TRANSACTION_TYPE.DEPOSIT}
              alignHeader="center"
              bodyClassName={`amount trans-${TRANSACTION_TYPE.DEPOSIT}`}
              body={(rowData) =>
                templateAmountBody(rowData, TRANSACTION_TYPE.DEPOSIT)
              }
              style={{ width: '30%' }}
            />
            <Column
              field={TRANSACTION_TYPE.WITHDRAW}
              header={TRANSACTION_TYPE.WITHDRAW}
              alignHeader="center"
              bodyClassName={`amount trans-${TRANSACTION_TYPE.WITHDRAW}`}
              body={(rowData) =>
                templateAmountBody(rowData, TRANSACTION_TYPE.WITHDRAW)
              }
              style={{ width: '30%' }}
            />
            <Column
              field={TRANSACTION_TYPE.REVENUE}
              header={TRANSACTION_TYPE.REVENUE}
              alignHeader="center"
              bodyClassName={`amount trans-${TRANSACTION_TYPE.REVENUE}`}
              body={(rowData) =>
                templateAmountBody(rowData, TRANSACTION_TYPE.REVENUE)
              }
              style={{ width: '30%' }}
            />
          </DataTable>
        </div>
      </section>
    </div>
  );
}
