import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Message, Button, Panel, ProgressSpinner } from '@/assets/js/PrimeReact'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AuthGuard({ children }) {
  const { isInitialized, isSignedIn, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isInitialized && !isSignedIn && location.pathname !== '/login') {
      navigate('/login', { replace: true })
    }
  }, [isInitialized, isSignedIn, location.pathname, navigate])

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  if (!isInitialized) {
    return (
      <div className="full-page">
        <ProgressSpinner />
        <p>인증 상태 확인 중...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="full-page">
        <ProgressSpinner />
        <p>로그인 페이지로 이동 중...</p>
      </div>
    )
  }

  return children
}
