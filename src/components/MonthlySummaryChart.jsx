import { Chart } from '@/assets/js/PrimeReact';
import dayjs from 'dayjs';

export default function MonthlySummaryChart({ months, rawData }) {
  // 테마 변수 가져오기
  const rootStyle = getComputedStyle(document.documentElement);

  const labels = ['수입', '지출', '이체'];

  const chartData = {
    labels: labels,
    datasets: months.map((m, idx) => {
      return {
        label: dayjs(m).format('M월'),
        // 월별 색상 (인덱스에 따라 파란색 계열 구분)
        backgroundColor: idx === 2 ? '#3B82F6' : idx === 1 ? '#60A5FA' : '#93C5FD',
        data: [rawData[m]['수입'], rawData[m]['지출'], rawData[m]['이체']]
      };
    })
  };

  const chartOptions = {
    maintainAspectRatio: false,
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

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="summary-chart-container">
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
