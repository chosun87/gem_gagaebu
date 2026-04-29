import { useAuth } from '@/context/AuthContext';
import { Message, Button, Panel, ProgressSpinner } from '@/assets/js/PrimeReact';

export default function AuthGuard({ children }) {
  const { isInitialized, isSignedIn, login } = useAuth();

  if (!isInitialized) {
    return (
      <div className="full-page">
        <ProgressSpinner />
        <p>인증 상태 확인 중...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className='full-page'>
        <Message severity="warn" text="구글 로그인이 필요합니다." />
        <Button size="large"
          label="구글 로그인"
          icon="pi pi-google"
          style={{ marginTop: 'var(--padding-base)' }}
          onClick={login}
        />
      </div>
    );
  }

  return children;
}
