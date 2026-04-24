import { Button } from '@/components/PrimeReact';
import { useAuth } from '@/context/AuthContext';
import { toggleFullscreen, useFullscreenStatus } from '@/assets/js/Fullscreen';

export default function Header({ onThemeClick }) {
  const { isInitialized, isSignedIn, login, logout } = useAuth();
  const isFullscreen = useFullscreenStatus();

  return (
    <header className="app-header shadow-2">
      <h1 className="app-header-title">
        <img className="app-header-logo" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Logo" />
        가계부
      </h1>
      <div className="app-header-buttons">
        <Button className="fullscreen text-base" severity="info" rounded text raised size="small"
          icon={isFullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand"}
          tooltip={isFullscreen ? "화면 축소" : "전체화면"}
          tooltipOptions={{ position: 'left' }}
          onClick={toggleFullscreen}
        />
        <Button className="theme text-base" severity="info" rounded text raised size="small"
          icon="pi pi-palette"
          tooltip="테마"
          tooltipOptions={{ position: 'left' }}
          onClick={onThemeClick}
        />
        <Button className="refresh text-base" severity="info" rounded text raised size="small"
          icon="pi pi-refresh"
          tooltip="새로고침"
          tooltipOptions={{ position: 'left' }}
        />
        {isSignedIn ? (
          <Button className="login text-base" severity="primary" rounded text raised size="small"
            icon="pi pi-sign-out"
            tooltip="로그아웃"
            tooltipOptions={{ position: 'left' }}
            onClick={logout}
            disabled={!isInitialized}
          />
        ) : (
          <Button className="login text-base" severity="primary" rounded text raised size="small"
            icon="pi pi-user"
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

