import { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Chart, TabView, TabPanel, Button } from '@/assets/js/PrimeReact';
import dayjs from 'dayjs';

export default function Statistics() {
  const { yearData, selectedDate, setSelectedDate, categoryOptions } =
    useData();
  const [activeIndex, setActiveIndex] = useState(1); // 0: 주간, 1: 월간, 2: 연간

  const { chartData, chartOptions, listData, totalAmount } = useMemo(() => {
    // 1. 선택된 달의 지출 데이터만 필터링
    const monthData = (yearData || []).filter((item) => {
      if (item.gDeleted || item.gType !== '지출') return false;
      const d = dayjs(item.gDate);
      return (
        d.year() === selectedDate.getFullYear() &&
        d.month() === selectedDate.getMonth()
      );
    });

    // 2. 카테고리별 합산
    const categoryTotals = {};
    let totalExpense = 0;
    monthData.forEach((item) => {
      const cat = item.gCategory || '기타';
      const amount = Math.abs(Number(item.gAmount) || 0); // 지출은 양수로 표기
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      totalExpense += amount;
    });

    // 따뜻하고 조화로운 색상 팔레트
    const colors = [
      '#e87461',
      '#f5a65b',
      '#f9d266',
      '#c4e082',
      '#97d296',
      '#7ac4cb',
      '#8cb2de',
      '#a69cd9',
      '#c98fc9',
      '#e685a6',
      '#a0a0a0',
    ];

    // 3. 금액순 정렬 및 퍼센트 계산
    const sortedCategories = Object.keys(categoryTotals)
      .map((cat) => {
        const amount = categoryTotals[cat];
        const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;

        const catNode = categoryOptions
          .find((group) => group.cdGroup === '지출')
          ?.children?.find((c) => c.cd === cat);
        return {
          id: cat,
          name: catNode?.cdLabel || cat,
          icon: catNode?.cdIcon || 'pi pi-tag',
          amount,
          percent,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // 정렬된 순서대로 색상 할당
    sortedCategories.forEach((cat, idx) => {
      cat.color = colors[idx % colors.length];
    });

    // 4. 차트 데이터 생성
    const data = {
      labels: sortedCategories.map((c) => `${c.name} ${c.percent.toFixed(1)}%`),
      datasets: [
        {
          data: sortedCategories.map((c) => c.amount),
          backgroundColor: sortedCategories.map((c) => c.color),
          hoverBackgroundColor: sortedCategories.map((c) => c.color),
          borderWidth: 1,
          borderColor: '#ffffff',
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          position: 'left',
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: {
              family: 'Inter, sans-serif',
            },
          },
        },
      },
      maintainAspectRatio: false,
    };

    return {
      chartData: data,
      chartOptions: options,
      listData: sortedCategories,
      totalAmount: totalExpense,
    };
  }, [yearData, selectedDate, categoryOptions]);

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const handlePrev = () => {
    setSelectedDate((prev) => dayjs(prev).subtract(1, 'month').toDate());
  };

  const handleNext = () => {
    setSelectedDate((prev) => dayjs(prev).add(1, 'month').toDate());
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const renderContent = () => (
    <div className="flex flex-column h-full w-full bg-white">
      {/* 1. 상단 헤더 (날짜 이동) */}
      <div className="flex justify-content-center align-items-center p-3 surface-card border-bottom-1 surface-border">
        <div className="flex align-items-center gap-1">
          <Button
            icon="pi pi-angle-left"
            text
            rounded
            severity="secondary"
            onClick={handlePrev}
          />
          <span className="text-xl font-bold px-4">
            {dayjs(selectedDate).format('YYYY년 M월')}
          </span>
          <Button
            icon="pi pi-angle-right"
            text
            rounded
            severity="secondary"
            onClick={handleNext}
          />
        </div>
      </div>

      {/* 2. 본문 영역 */}
      <div className="flex-1 overflow-auto p-3 surface-ground">
        {totalAmount > 0 ? (
          <div className="bg-white border-round shadow-1 p-3 mb-4">
            {/* 차트 영역 */}
            <div
              className="flex justify-content-center mb-5"
              style={{ height: '280px' }}
            >
              <Chart
                type="pie"
                data={chartData}
                options={chartOptions}
                className="w-full flex justify-content-center"
              />
            </div>

            {/* 리스트 영역 */}
            <div className="border-top-1 surface-border pt-3">
              {listData.map((item) => (
                <div
                  key={item.id}
                  className="flex align-items-center py-3 border-bottom-1 surface-border"
                >
                  <div className="flex align-items-center gap-3 flex-1">
                    <span
                      className="border-round text-center text-sm font-bold text-white px-2 py-1"
                      style={{ backgroundColor: item.color, minWidth: '45px' }}
                    >
                      {Math.round(item.percent)}%
                    </span>
                    <span className="flex align-items-center gap-2">
                      <i className={`${item.icon} text-lg`}></i>
                      <span className="font-bold text-700">{item.name}</span>
                    </span>
                  </div>
                  <div className="text-lg font-bold text-800">
                    {item.amount.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>

            {/* 합계 영역 */}
            <div className="flex justify-content-end mt-4 p-3 surface-ground border-round">
              <div className="text-xl font-bold text-800 flex align-items-center gap-3">
                <span>지출</span>
                <span className="text-primary text-2xl">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-column align-items-center justify-content-center h-full text-500 gap-3 pt-6">
            <i className="pi pi-chart-pie text-6xl text-300"></i>
            <p>선택한 월에 지출 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-page statistics-page">
      <TabView
        className="ledger-tabview"
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel
          header={<span className="text-lg">주간</span>}
          className="p-0"
        >
          {renderContent()}
        </TabPanel>
        <TabPanel
          header={<span className="text-lg">월간</span>}
          className="p-0"
        >
          {renderContent()}
        </TabPanel>
        <TabPanel
          header={<span className="text-lg">연간</span>}
          className="p-0"
        >
          {renderContent()}
        </TabPanel>
      </TabView>
    </div>
  );
}
