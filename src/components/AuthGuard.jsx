import { useAuth } from '@/context/AuthContext';
import { Message } from '@/components/PrimeReact';

export default function AuthGuard({ children }) {
  const { isInitialized, isSignedIn } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex align-items-center justify-content-center h-full p-5">
        <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
        <p>인증 상태 확인 중...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex align-items-center justify-content-center h-full p-5">
        <Message severity="warn" text="구글 로그인이 필요합니다." />
      </div>
    );
  }

  return children;
}
