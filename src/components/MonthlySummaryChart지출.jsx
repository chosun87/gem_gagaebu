import { Chart } from '@/assets/js/PrimeReact';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import dayjs from 'dayjs';
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TRANSACTION_TYPE } from '@/assets/js/constants';

ChartJS.register(ChartDataLabels);

export default function MonthlySummaryChart지출({ months, rawData }) {
  const { categoryMap } = useData();
  const { chartColor } = useTheme();
  const rootStyle = getComputedStyle(document.documentElement);

  // 테마 색상 가져오기 헬퍼
  const getThemeColor = (colorName, shade) => {
    const varName =
      colorName === 'primary'
        ? `--primary-${shade}`
        : `--${colorName}-${shade}`;
    return (
      rootStyle.getPropertyValue(varName).trim() ||
      (shade === '500' ? '#3B82F6' : '#93C5FD')
    );
  };

  // 데이터에 존재하는 카테고리 추출
  const presentCategories = new Set();
  months.forEach((m) => {
    Object.keys(rawData[m]).forEach((key) => {
      if (
        rawData[m][key] > 0 &&
        ![
          'total',
          'month',
          TRANSACTION_TYPE.EXPENSE,
          TRANSACTION_TYPE.INCOME,
          TRANSACTION_TYPE.TRANSFER,
        ].includes(key)
      ) {
        presentCategories.add(key);
      }
    });
  });
  const categoryList = Array.from(presentCategories).sort((a, b) => {
    const orderA = categoryMap[a]?.cdOrder || 999;
    const orderB = categoryMap[b]?.cdOrder || 999;
    return orderB - orderA;
  });

  const chartData = {
    labels: months.map((m) => dayjs(m).format('YYYY-MM')),
    datasets: categoryList.map((catCode, idx) => {
      // 카테고리별로 다른 셰이드 적용 (100~900)
      const shade = ((idx % 9) + 1) * 100;
      return {
        label: categoryMap[catCode]?.cdLabel || catCode,
        backgroundColor: getThemeColor(chartColor, shade),
        data: months.map((m) => rawData[m][catCode] || 0),
      };
    }),
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        reverse: true, // 범례는 데이터셋의 역순으로 표시 (내림차순 데이터셋 -> 오름차순 범례)
        labels: {
          color: rootStyle.getPropertyValue('--text-color') || '#495057',
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 10,
        },
        display: (context) => {
          const dataset = context.dataset;
          const value = dataset.data[context.dataIndex];
          const month = months[context.dataIndex];
          const total = rawData[month].total;
          return total > 0 && value / total >= 0.1; // 10% 이상일 때만
        },
        formatter: (value, context) => {
          const month = months[context.dataIndex];
          const total = rawData[month].total;
          return ((value / total) * 100).toFixed(1) + '%';
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        itemSort: (a, b) => {
          const orderA =
            categoryMap[categoryList[a.datasetIndex]]?.cdOrder || 0;
          const orderB =
            categoryMap[categoryList[b.datasetIndex]]?.cdOrder || 0;
          return orderA - orderB; // 툴팁 오름차순
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + '원';
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color:
            rootStyle.getPropertyValue('--text-color-secondary') || '#6c757d',
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color:
            rootStyle.getPropertyValue('--text-color-secondary') || '#6c757d',
          callback: function (value) {
            if (value >= 10000) return (value / 10000).toLocaleString() + '만';
            return value.toLocaleString();
          },
        },
        grid: {
          color: rootStyle.getPropertyValue('--surface-border') || '#dfe7ef',
        },
      },
    },
  };

  return (
    <div className="summary-chart-container" style={{ minHeight: '40vh' }}>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
