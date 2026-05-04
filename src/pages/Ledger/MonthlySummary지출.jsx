import { Chart as ChartJS, registerables } from 'chart.js';
import { useMemo, useEffect, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { useMonthSync } from '@/hooks/useMonthSync';
import { DataTable, Column, Row, ColumnGroup } from '@/assets/js/PrimeReact';
import dayjs from 'dayjs';
import { TRANSACTION_TYPE } from '@/assets/js/constants';

import MonthNavigator from '@/components/MonthNavigator';
import MonthlySummaryChart지출 from '@/components/MonthlySummaryChart지출';

const MONTH_LENGTH = 3;

ChartJS.register(...registerables);

export default function MonthlySummaryExpenses({ monthLength = MONTH_LENGTH }) {
  const {
    sheetYYYYData,
    loadedSheetYYYY,
    loadSheet연도Data,
    selectedDate,
    categoryOptions,
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
    // 1. 지출 카테고리 목록 가져오기
    const categoryList =
      categoryOptions.find((node) => node.cdGroup === TRANSACTION_TYPE.EXPENSE)
        ?.children || [];

    // 2. 데이터 초기화 (월별, 카테고리별)
    const rawData = {};
    months.forEach((m) => {
      rawData[m] = { month: m, total: 0, 지출: 0 };
      categoryList.forEach((category) => {
        rawData[m][category.cd] = 0;
      });
    });

    // 3. 전체 데이터 합산
    const allData = [];
    requiredYears.forEach((year) => {
      if (sheetYYYYData[year]) {
        allData.push(...sheetYYYYData[year]);
      }
    });

    allData.forEach((item) => {
      if (item.gDeleted || item.gType !== TRANSACTION_TYPE.EXPENSE) return;

      // 합계 제외 카테고리 체크
      const catInfo = categoryMap[item.gCategory];
      if (catInfo && catInfo.cdAddSum === false) return;

      const m = dayjs(item.gDate).format('YYYY-MM');
      if (rawData[m] && rawData[m][item.gCategory] !== undefined) {
        rawData[m][item.gCategory] += item.gAmount;
        rawData[m].total += item.gAmount;
        rawData[m][TRANSACTION_TYPE.EXPENSE] = rawData[m].total; // 차트 호환성 유지
      }
    });

    // 4. 테이블용 데이터 변환 (카테고리별 행 구성)
    const tableData = categoryList
      .map((cat) => {
        const row = {
          categoryCode: cat.cd,
          categoryLabel: cat.cdLabel,
          categoryIcon: cat.cdIcon,
          categoryOrder: cat.cdOrder,
        };
        months.forEach((m) => {
          row[m] = rawData[m][cat.cd] || 0;
        });
        // 전체 합계
        row.sum = months.reduce((acc, m) => acc + row[m], 0);
        return row;
      })
      .filter((row) => row.sum > 0) // 지출이 있는 카테고리만
      .sort((a, b) => a.categoryOrder - b.categoryOrder);

    return { months, tableData, rawData, categoryList };
  }, [sheetYYYYData, months, requiredYears, categoryOptions, categoryMap]);

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
    '/ledger/monthlySummaryExpenses',
  );

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateAmountBody = (rowData, field) => {
    return <>{(rowData[field] || 0).toLocaleString()}</>;
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="분류" style={{ width: '20%', minWidth: '7rem' }} />
        {summaryData.months.map((m) => (
          <Column
            key={m}
            header={dayjs(m).format('YYYY-MM')}
            colSpan={2}
            alignHeader="center"
            style={{ width: `${80 / summaryData.months.length}%` }}
          />
        ))}
      </Row>
    </ColumnGroup>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="합계" align="center" />
        {summaryData.months.map((m) => [
          <Column
            key={m + '_famt'}
            footer={summaryData.rawData[m].total.toLocaleString()}
            className="amount"
          />,
          <Column key={m + '_fpct'} footer="" className="percentage" />,
        ])}
      </Row>
    </ColumnGroup>
  );

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

        <MonthlySummaryChart지출
          months={summaryData.months}
          rawData={summaryData.rawData}
        />

        <div className="summary-table-container">
          <DataTable
            stripedRows
            responsiveLayout="scroll"
            value={summaryData.tableData}
            headerColumnGroup={headerGroup}
            footerColumnGroup={footerGroup}
          >
            <Column
              field="categoryLabel"
              bodyClassName="px-0 font-bold"
              body={(rowData) => (
                <span>
                  <i className={rowData.categoryIcon}></i>{' '}
                  {rowData.categoryLabel}
                </span>
              )}
            />
            {summaryData.months.flatMap((m) => [
              <Column
                key={m}
                field={m}
                bodyClassName="amount"
                body={(rowData) => templateAmountBody(rowData, m)}
              />,
              <Column
                key={m + '_pct'}
                bodyClassName="percentage-sm"
                body={(rowData) => {
                  const total = summaryData.rawData[m].total;
                  const val = rowData[m] || 0;
                  if (!total) return '(0.0%)';
                  return `(${((val / total) * 100).toFixed(1)}%)`;
                }}
              />,
            ])}
          </DataTable>
        </div>
      </section>
    </div>
  );
}
