import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { TabView, TabPanel, ProgressSpinner } from '@/assets/js/PrimeReact';

import { useData } from '@/context/DataContext';
import dayjs from 'dayjs';

const Calendar = lazy(() => import('@/pages/Ledger/Calendar'));
const MonthlyList = lazy(() => import('@/pages/Ledger/MonthlyList'));
const MonthlySummary = lazy(() => import('@/pages/Ledger/MonthlySummary'));
const Repeat = lazy(() => import('@/pages/Ledger/Repeat'));

const TabLoading = () => (
  <div className="full-page">
    <ProgressSpinner />
  </div>
);

export default function Ledger() {
  const { selectedDate } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  let activeIndex = 0;
  if (location.pathname.includes('/monthlyList')) {
    activeIndex = 1;
  } else if (location.pathname.includes('/monthlySummary')) {
    activeIndex = 2;
  } else if (location.pathname.includes('/repeat')) {
    activeIndex = 3;
  }

  const handleTabChange = (e) => {
    const yearMonth = dayjs(selectedDate).format('YYYYMM');

    switch (e.index) {
      case 0:
        navigate(`/ledger/calendar/${yearMonth}`);
        break;
      case 1:
        navigate(`/ledger/monthlyList/${yearMonth}`);
        break;
      case 2:
        navigate(`/ledger/monthlySummary/${yearMonth}`);
        break;
      case 3:
        navigate('/ledger/repeat');
        break;
      default:
        navigate(`/ledger/calendar/${yearMonth}`);
    }
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="app-page ledger-page">
      <Routes>
        <Route path="/" element={<Navigate to="/ledger/calendar" replace />} />

        <Route path="*" element={
          <TabView className="ledger-tabview" activeIndex={activeIndex} onTabChange={handleTabChange}>
            <TabPanel header={<span className="text-lg">달력</span>} leftIcon="pi pi-calendar mr-2">
              <Suspense fallback={<TabLoading />}>
                <Routes>
                  <Route path="calendar/:yearMonth" element={<Calendar />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="*" element={<Calendar />} />
                </Routes>
              </Suspense>
            </TabPanel>
            <TabPanel header={<span className="text-lg">목록</span>} leftIcon="pi pi-list-check mr-2" className="px-0">
              <Suspense fallback={<TabLoading />}>
                <Routes>
                  <Route path="monthlyList/:yearMonth" element={<MonthlyList />} />
                  <Route path="monthlyList" element={<MonthlyList />} />
                  <Route path="*" element={<MonthlyList />} />
                </Routes>
              </Suspense>
            </TabPanel>
            <TabPanel header={<span className="text-lg">그래프</span>} leftIcon="pi pi-chart-bar mr-2">
              <Suspense fallback={<TabLoading />}>
                <Routes>
                  <Route path="monthlySummary/:yearMonth/:months" element={<MonthlySummary monthLength={4} />} />
                  <Route path="monthlySummary/:yearMonth" element={<MonthlySummary monthLength={4} />} />
                  <Route path="monthlySummary" element={<MonthlySummary monthLength={4} />} />
                  <Route path="*" element={<MonthlySummary monthLength={4} />} />
                </Routes>
              </Suspense>
            </TabPanel>
            <TabPanel header={<span className="text-lg">반복</span>} leftIcon="pi pi-clone mr-2" className="px-0">
              <Suspense fallback={<TabLoading />}>
                <Repeat />
              </Suspense>
            </TabPanel>
          </TabView>
        } />
      </Routes>
    </div>
  );
}
