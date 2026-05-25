import { useEffect, useMemo, useCallback, lazy, Suspense } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import AuthGuard from '@/components/common/AuthGuard'

// 페이지 컴포넌트 다이나믹 로딩 (Code Splitting)
const Ledger = lazy(() => import('@/pages/Ledger'))
const Statistics = lazy(() => import('@/pages/Statistics'))
const Assets = lazy(() => import('@/pages/Assets'))
const Login = lazy(() => import('@/pages/Login')) // Login 페이지 추가

// 다이얼로그 컴포넌트 다이나믹 로딩
const DialogSettings = lazy(
  () => import('@/components/Settings/DialogSettings'),
)
const DialogTheme = lazy(() => import('@/components/common/DialogTheme'))
const Repeat = lazy(() => import('@/pages/Settings/Repeat'))

// 샘플 페이지 다이나믹 로딩
const Blank = lazy(() => import('@/samples/pages/blank'))
const BlankSidebarRight = lazy(
  () => import('@/samples/pages/blankSidebarRight'),
)
const BlankSidebarBottom = lazy(
  () => import('@/samples/pages/blankSidebarBottom'),
)
const BlankMonthly = lazy(() => import('@/samples/pages/blankMonthly'))

import { ConfirmDialog, ProgressSpinner } from '@/assets/js/PrimeReact'

const PageLoading = () => (
  <div className="full-page">
    <ProgressSpinner />
  </div>
)

function App() {
  const { isSignedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // 배경이 될 위치 (다이얼로그가 떠도 뒤에 깔릴 화면)
  const background = location.state && location.state.background

  useEffect(() => {
    if (location.pathname === '/logout') {
      logout()
      navigate('/login', { replace: true })
    }
  }, [location.pathname, logout, navigate])

  const menuItems = useMemo(
    () => [
      { path: '/ledger', label: '가계부' },
      { path: '/assets', label: '자산' },
      { path: '/statistics', label: '통계' },
      { path: '/settings', label: '설정' },
    ],
    [],
  )

  const activeIndex = useMemo(() => {
    const index = menuItems.findIndex((item) =>
      location.pathname.startsWith(item.path),
    )
    return index === -1 ? 0 : index
  }, [location.pathname, menuItems])

  const handleMenuChange = useCallback(
    (index) => {
      const item = menuItems[index]
      if (item.path === '/settings') {
        navigate(item.path, { state: { background: location } })
      } else {
        navigate(item.path)
      }
    },
    [navigate, location, menuItems],
  )

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="app-container">
      <Header
        onThemeClick={() =>
          navigate('/theme', { state: { background: location } })
        }
      />

      <main className="app-content">
        {/* AuthGuard 밖으로 Login 페이지와 다이얼로그 라우트를 이동 */}
        <Routes location={background || location}>
          <Route path="/login" element={<Suspense fallback={<PageLoading />}><Login /></Suspense>} />
          <Route path="/theme" element={<Suspense fallback={<PageLoading />}><DialogTheme /></Suspense>} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                {/* background가 있으면 해당 위치를 렌더링하여 배경 유지 */}
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route path="/ledger/*" element={<Ledger />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/assets/*" element={<Assets />} />
                    <Route path="/settings" element={<DialogSettings />} />
                    <Route path="/settings/repeat" element={<Repeat />} />
                    <Route path="/" element={<Navigate replace to="/ledger" />} />
                    {/* 샘플 페이지 라우트 */}
                    <Route path="/blank" element={<Blank />} />
                    <Route path="/blankSidebarRight" element={<BlankSidebarRight />} />
                    <Route path="/blankSidebarBottom" element={<BlankSidebarBottom />} />
                    <Route path="/blankMonthly" element={<BlankMonthly />} />
                  </Routes>
                </Suspense>
              </AuthGuard>
            }
          />
        </Routes>

        {/* background가 있으면 다이얼로그를 렌더링 (AuthGuard 안으로 이동) */}
        {background && (
          <Routes>
            <Route path="/theme" element={<Suspense fallback={<PageLoading />}><DialogTheme /></Suspense>} />
          </Routes>
        )}
      </main>

      {isSignedIn && (
        <>
          <Footer activeIndex={activeIndex} onMenuChange={handleMenuChange} />

          <Suspense fallback={null}>
            <DialogSettings
              visible={location.pathname === '/settings'}
              onHide={() => navigate(-1)}
            />
          </Suspense>
        </>
      )}

      <Suspense fallback={null}>
        <DialogTheme
          visible={location.pathname.startsWith('/theme')}
          onHide={() => {
            if (location.pathname.startsWith('/theme')) navigate(-1)
          }}
        />
      </Suspense>

      <ConfirmDialog />
    </div>
  )
}

export default App
