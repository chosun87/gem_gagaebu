import 'chart.js/auto';
import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Chart, Dropdown, Calendar as PrimeCalendar } from '@/components/PrimeReact';
import dayjs from 'dayjs';

export default function MonthlySummary() {
  const { yearData, loading, selectedDate, setSelectedDate } = useData();

  // 월 변경
  const handleMonthChange = (e) => {
    const newDate = new Date(e.year, e.month - 1, 1);
    setSelectedDate(newDate);
  }

  // yearNavigator monthNavigator에 의한 월 변경
  const handleViewDateChange = (e) => {
    setSelectedDate(e.value);
  }

  // 최근 3개월 데이터 계산 및 차트 데이터 가공
  const summaryData = useMemo(() => {
    const months = [];
    for (let i = 2; i >= 0; i--) {
      months.push(dayjs(selectedDate).subtract(i, 'month').format('YYYY-MM'));
    }

    const dataMap = {};
    months.forEach(m => {
      dataMap[m] = { 수입: 0, 지출: 0, 이체: 0 };
    });

    (yearData || []).forEach(item => {
      if (item.gDeleted) return;
      const m = dayjs(item.gDate).format('YYYY-MM');
      if (dataMap[m]) {
        dataMap[m][item.gType] += item.gAmount;
      }
    });

    const labels = months.map(m => dayjs(m).format('M월'));
    const incomeData = months.map(m => dataMap[m]['수입']);
    const expenseData = months.map(m => dataMap[m]['지출']);
    const transferData = months.map(m => dataMap[m]['이체']);

    // CSS 변수에서 색상 가져오기 (없으면 기본값)
    const rootStyle = getComputedStyle(document.documentElement);
    const colorIncome = rootStyle.getPropertyValue('--color-수입').trim() || '#22C55E';
    const colorExpense = rootStyle.getPropertyValue('--color-지출').trim() || '#EF4444';
    const colorTransfer = rootStyle.getPropertyValue('--color-이체').trim() || '#3B82F6';

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: '수입',
          backgroundColor: colorIncome,
          data: incomeData
        },
        {
          label: '지출',
          backgroundColor: colorExpense,
          data: expenseData
        },
        {
          label: '이체',
          backgroundColor: colorTransfer,
          data: transferData
        }
      ]
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
            callback: function(value) {
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

    return { months, dataMap, chartData, chartOptions };
  }, [yearData, selectedDate]);

  // Calendar 월 선택 템플릿 (UI 일관성)
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

      <div className="summary-chart-container flex-grow-1" style={{ minHeight: '250px' }}>
        <h3 className="text-center mb-3">최근 3개월 비교</h3>
        <Chart type="bar" data={summaryData.chartData} options={summaryData.chartOptions} />
      </div>

      <div className="summary-table-container pb-4">
        <h3 className="text-center mb-3">3개월 합계</h3>
        <div className="flex flex-column gap-2">
          {summaryData.months.map(m => (
            <div key={m} className="summary-row card p-3 shadow-1 border-round flex flex-column gap-2">
              <div className="font-bold text-lg border-bottom-1 surface-border pb-1">
                {dayjs(m).format('YYYY년 M월')}
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm opacity-70">수입</span>
                <span className="gType-수입 font-bold">{summaryData.dataMap[m]['수입'].toLocaleString()}원</span>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm opacity-70">지출</span>
                <span className="gType-지출 font-bold">{summaryData.dataMap[m]['지출'].toLocaleString()}원</span>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-sm opacity-70">이체</span>
                <span className="gType-이체 font-bold">{summaryData.dataMap[m]['이체'].toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
