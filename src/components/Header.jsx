import { Button } from '@/components/PrimeReact';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { isInitialized, isSignedIn, login, logout } = useAuth();

  return (
    <header className="app-header shadow-2">
      <h1 className="app-header-title">가계부</h1>
      <div className="app-header-buttons">
        <Button className="theme" icon="pi pi-palette" severity="secondary" rounded text raised size="small"
          tooltip="테마"
          tooltipOptions={{ position: 'left' }}
        />
        <Button className="refresh" icon="pi pi-refresh" severity="primary" rounded text raised size="small"
          tooltip="새로고침"
          tooltipOptions={{ position: 'left' }}
        />
        {isSignedIn ? (
          <Button className="login" icon="pi pi-sign-out" severity="primary" rounded text raised size="small"
            tooltip="로그아웃"
            tooltipOptions={{ position: 'left' }}
            onClick={logout}
            disabled={!isInitialized}
          />
        ) : (
          <Button className="login" icon="pi pi-user" severity="primary" rounded text raised size="small"
            tooltip="로그인"
            tooltipOptions={{ position: 'left' }}
            onClick={login}
            disabled={!isInitialized}
          />
        )}
      </div>
    </header>
  );
}

