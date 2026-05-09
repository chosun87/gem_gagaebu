import { lazy, Suspense, useMemo, useCallback } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { TabView, TabPanel, ProgressSpinner } from '@/assets/js/PrimeReact';

import { useData } from '@/context/DataContext';
import dayjs from 'dayjs';

const AssetList = lazy(() => import('@/pages/Assets/AssetList'));
const AssetsMonthlySummary = lazy(
  () => import('@/pages/Ledger/MonthlySummary'),
);
const AssetsYearlySummary = lazy(
  () => import('@/pages/Ledger/MonthlySummary지출'),
);

const TabLoading = () => (
  <div className="full-page">
    <ProgressSpinner />
  </div>
);

export default function Assets() {
  const { selectedDate } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      {
        path: 'list',
        header: '목록',
        icon: 'pi pi-list-check mr-2',
        element: <AssetList />,
      },
      {
        path: 'monthlySummary',
        header: '월별요약',
        icon: 'pi pi-chart-bar mr-2',
        element: <AssetsMonthlySummary monthLength={6} />,
      },
      {
        path: 'yearlySummary',
        header: '연도별요약',
        icon: 'pi pi-chart-pie mr-2',
        element: <AssetsYearlySummary monthLength={6} />,
        // isReady: false,
      },
    ],
    [],
  );

  const activeIndex = useMemo(() => {
    const segments = location.pathname.split('/');
    const index = tabs.findIndex((tab) => segments.includes(tab.path));
    return index === -1 ? 0 : index;
  }, [location.pathname, tabs]);

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const handleTabChange = useCallback(
    (e) => {
      const yearMonth = dayjs(selectedDate).format('YYYYMM');
      const targetPath = tabs[e.index].path;
      navigate(`/assets/${targetPath}/${yearMonth}`);
    },
    [navigate, selectedDate, tabs],
  );

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="app-page assets-page">
      <Routes>
        <Route path="/" element={<Navigate to="/assets/list" replace />} />
        <Route
          path="*"
          element={
            <TabView
              className="assets-tabview"
              activeIndex={activeIndex}
              onTabChange={handleTabChange}
            >
              {tabs.map((tab) => (
                <TabPanel
                  key={tab.path}
                  header={<span className="text-lg">{tab.header}</span>}
                  leftIcon={tab.icon}
                >
                  {tab.isReady !== false ? (
                    <Suspense fallback={<TabLoading />}>
                      <Routes>
                        <Route
                          path={`${tab.path}/:yearMonth/*`}
                          element={tab.element}
                        />
                        <Route path={`${tab.path}/*`} element={tab.element} />
                        <Route path="*" element={tab.element} />
                      </Routes>
                    </Suspense>
                  ) : (
                    <div className="p-4 text-center text-500">
                      <i
                        className={`${tab.icon.split(' ')[0]} text-6xl mb-3 opacity-30`}
                      ></i>
                      <p>{tab.header} 서비스 준비 중입니다.</p>
                    </div>
                  )}
                </TabPanel>
              ))}
            </TabView>
          }
        />
      </Routes>
    </div>
  );
}
