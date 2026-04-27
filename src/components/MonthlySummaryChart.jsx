import { Chart } from '@/assets/js/PrimeReact';
import { useTheme } from '@/context/ThemeContext';
import dayjs from 'dayjs';

export default function MonthlySummaryChart({ months, rawData }) {
  const { chartColor } = useTheme();
  // 테마 변수 가져오기
  const rootStyle = getComputedStyle(document.documentElement);

  const labels = ['수입', '지출', '이체'];

  const chartData = {
    labels: labels,
    datasets: months.map((m, idx) => {
      const getThemeColor = (colorName, shade) => {
        const varName = colorName === 'primary' ? `--primary-${shade}` : `--${colorName}-${shade}`;
        return rootStyle.getPropertyValue(varName).trim() || (shade === '500' ? '#3B82F6' : shade === '400' ? '#60A5FA' : '#93C5FD');
      };

      const shade = (idx + 1) * 100;
      return {
        label: dayjs(m).format('M월'),
        backgroundColor: getThemeColor(chartColor, shade),
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
