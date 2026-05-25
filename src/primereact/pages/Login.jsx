import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button, ProgressSpinner, Message } from '@/assets/js/PrimeReact'

export default function Login() {
  const { isSignedIn, login, isInitialized } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isInitialized && isSignedIn) {
      navigate('/ledger', { replace: true })
    }
  }, [isInitialized, isSignedIn, navigate])

  if (!isInitialized) {
    return (
      <div className="full-page flex-column">
        <ProgressSpinner />
        <p>인증 상태 확인 중...</p>
      </div>
    )
  }

  return (
    <div className="full-page flex-column">
      <Message severity="info" text="로그인이 필요합니다." />
      <Button
        size="large" raised
        className="btn-login p-button-google"
        icon="pi pi-google"
        label="Google 계정으로 로그인"
        onClick={login}
      />
    </div>
  )
}
