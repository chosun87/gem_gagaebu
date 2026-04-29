import { useAuth } from '@/context/AuthContext';
import { Message, Button, Panel } from '@/assets/js/PrimeReact';

export default function AuthGuard({ children }) {
  const { isInitialized, isSignedIn, login } = useAuth();

  if (!isInitialized) {
    return (
      <Panel className='isNotInitialized'>
        <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
        <p>인증 상태 확인 중...</p>
      </Panel>
    );
  }

  if (!isSignedIn) {
    return (
      <Panel className='isNotSignedIn'>
        <Message severity="warn" text="구글 로그인이 필요합니다." />
        <Button size="large"
          label="구글 로그인"
          icon="pi pi-google"
          style={{ marginTop: 'var(--padding-base)' }}
          onClick={login}
        />
      </Panel>
    );
  }

  return children;
}
