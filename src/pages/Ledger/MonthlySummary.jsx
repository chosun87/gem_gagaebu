import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Chart, Dropdown, Calendar as PrimeCalendar, DataTable, Column } from '@/components/PrimeReact';
import dayjs from 'dayjs';

export default function MonthlySummary() {
  const { yearData, loading, selectedDate, setSelectedDate } = useData();

  // 최근 3개월 데이터 계산 및 차트 데이터 가공
  const summaryData = useMemo(() => {
    const months = [];
    for (let i = 2; i >= 0; i--) {
      months.push(dayjs(selectedDate).subtract(i, 'month').format('YYYY-MM'));
    }

    const dataMap = {};
    months.forEach(m => {
      dataMap[m] = { month: m, 수입: 0, 지출: 0, 이체: 0 };
    });

    (yearData || []).forEach(item => {
      if (item.gDeleted) return;
      const m = dayjs(item.gDate).format('YYYY-MM');
      if (dataMap[m]) {
        dataMap[m][item.gType] += item.gAmount;
      }
    });

    const labels = ['수입', '지출', '이체'];
    const rootStyle = getComputedStyle(document.documentElement);

    // DataTable용 리스트 (최신순)
    const tableData = [...months].reverse().map(m => ({
      monthLabel: dayjs(m).format('YYYY-MM'),
      ...dataMap[m]
    }));

    const chartData = {
      labels: labels,
      datasets: months.map((m, idx) => {
        // 월별 색상 (투명도 조절로 구분)
        const alpha = 1 - (idx * 0.3);
        const colorBase = rootStyle.getPropertyValue('--primary-color').trim() || '#3B82F6';

        return {
          label: dayjs(m).format('M월'),
          backgroundColor: idx === 2 ? '#3B82F6' : idx === 1 ? '#60A5FA' : '#93C5FD', // 파란색 계열로 구분
          data: [dataMap[m]['수입'], dataMap[m]['지출'], dataMap[m]['이체']]
        };
      })
    };

    const chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: rootStyle.getPropertyValue('--text-color') || '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: rootStyle.getPropertyValue('--text-color-secondary') || '#6c757d',
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: rootStyle.getPropertyValue('--text-color-secondary') || '#6c757d',
            callback: function (value) {
              return (value / 10000).toLocaleString() + '만';
            }
          },
          grid: {
            color: rootStyle.getPropertyValue('--surface-border') || '#dfe7ef',
            drawBorder: false
          }
        }
      }
    };

    return { tableData, chartData, chartOptions };
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
    const amount = rowData[field] || 0;
    const colorClass = `gType-${field}`;
    return <span className={`${colorClass} monospace`}>{amount.toLocaleString()}</span>;
  };

  // Calendar 월 선택 템플릿
  const templateMonthNavigator = (e) => (
    <Dropdown className="month-dropdown" value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} />
  );
  const templateYearNavigator = (e) => (
    <Dropdown className="year-dropdown" value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} />
  );

  return (
    <div className="panel-inner summary-page flex flex-column gap-4">
      <PrimeCalendar className="month-calendar"
        inline
        locale="ko"
        yearNavigator yearNavigatorTemplate={templateYearNavigator}
        monthNavigator monthNavigatorTemplate={templateMonthNavigator}
        value={selectedDate}
        onMonthChange={handleMonthChange}
        onViewDateChange={handleViewDateChange}
      />

      <div className="summary-chart-container hidden">
        <h3 className="text-center mb-3">최근 3개월 비교</h3>
        <Chart type="bar" data={summaryData.chartData} options={summaryData.chartOptions} />
      </div>

      <div className="summary-table-container pb-4">
        {/* <h3 className="text-center mb-3">최근 3개월 합계</h3> */}
        <DataTable value={summaryData.tableData} responsiveLayout="scroll">
          <Column field="monthLabel" header="연월" className="font-bold"></Column>
          <Column field="수입" header="수입" body={(data) => amountBodyTemplate(data, '수입')} alignHeader="center" align="right"></Column>
          <Column field="지출" header="지출" body={(data) => amountBodyTemplate(data, '지출')} alignHeader="center" align="right"></Column>
          <Column field="이체" header="이체" body={(data) => amountBodyTemplate(data, '이체')} alignHeader="center" align="right"></Column>
        </DataTable>
      </div>
    </div>
  );
}
