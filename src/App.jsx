import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';

// 페이지 컴포넌트 다이나믹 로딩 (Code Splitting)
const Ledger = lazy(() => import('@/pages/Ledger'));
const Statistics = lazy(() => import('@/pages/Statistics'));
const Assets = lazy(() => import('@/pages/Assets'));

// 다이얼로그 컴포넌트 다이나믹 로딩
const DialogSettings = lazy(() => import('@/components/DialogSettings'));
const DialogTheme = lazy(() => import('@/components/DialogTheme'));

import { ConfirmDialog, ProgressSpinner } from '@/assets/js/PrimeReact';

const PageLoading = () => (
  <div className="full-page">
    <ProgressSpinner />
  </div>
);

function App() {
  const { isSignedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 배경이 될 위치 (다이얼로그가 떠도 뒤에 깔릴 화면)
  const background = location.state && location.state.background;

  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // Footer 메뉴 인덱스 매칭
  let activeIndex = 0;
  if (location.pathname.startsWith('/statistics')) {
    activeIndex = 1;
  } else if (location.pathname.startsWith('/asset')) {
    activeIndex = 2;
  } else if (location.pathname.startsWith('/settings')) {
    activeIndex = 3;
  } else {
    activeIndex = 0;
  }

  const handleMenuChange = (menuIndex) => {
    switch (menuIndex) {
      case 0:
        navigate('/ledger');
        break;
      case 1:
        navigate('/statistics');
        break;
      case 2:
        navigate('/asset');
        break;
      case 3:
        // 현재 위치를 배경으로 전달하며 설정으로 이동
        navigate('/settings', { state: { background: location } });
        break;
      default:
        navigate('/ledger');
    }
  };

  useEffect(() => {
    if (location.pathname === '/logout') {
      logout();
      navigate('/login', { replace: true });
    }
  }, [location.pathname, logout, navigate]);

  return (
    <div className="app-container">
      <Header onThemeClick={() => navigate('/theme', { state: { background: location } })} />

      <main className="app-content">
        <AuthGuard>
          {/* background가 있으면 해당 위치를 렌더링하여 배경 유지 */}
          <Suspense fallback={<PageLoading />}>
            <Routes location={background || location}>
              {/* 기본 리다이렉트 */}
              <Route path="/" element={<Navigate to="/ledger" replace />} />

              <Route path="/login" element={<Navigate to="/ledger" replace />} />

              {/* 메인 라우트 */}
              <Route path="/ledger/*" element={<Ledger />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/asset" element={<Assets />} />

              {/* 직접 접근 시 배경이 없을 경우를 위해 가계부를 기본으로 둠 */}
              <Route path="/settings" element={<Ledger />} />
              <Route path="/theme" element={<Ledger />} />
            </Routes>
          </Suspense>
        </AuthGuard>
      </main>

      {isSignedIn && (
        <>
          <Footer activeIndex={activeIndex} onMenuChange={handleMenuChange} />

          <Suspense fallback={null}>
            <DialogSettings
              visible={location.pathname.startsWith('/settings')}
              onHide={() => navigate(-1)}
            />
          </Suspense>
        </>
      )}

      <Suspense fallback={null}>
        <DialogTheme
          visible={location.pathname.startsWith('/theme') || isThemeOpen}
          onHide={() => {
            setIsThemeOpen(false);
            if (location.pathname.startsWith('/theme')) navigate(-1);
          }}
        />
      </Suspense>

      <ConfirmDialog />
    </div>
  );
}

export default App;
