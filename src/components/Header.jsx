import { useState, useEffect } from 'react';
import { Button } from '@/components/PrimeReact';
import { useAuth } from '@/context/AuthContext';

export default function Header({ onThemeClick }) {
  const { isInitialized, isSignedIn, login, logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 전체화면 상태 변화 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        /* iOS 등 미지원 환경 대비 */
      });
    } else {
      document.exitFullscreen().catch(() => {
        /* iOS 등 미지원 환경 대비 */
      });
    }
  };

  return (
    <header className="app-header shadow-2">
      <h1 className="app-header-title">가계부</h1>
      <div className="app-header-buttons">
        <Button className="fullscreen" severity="secondary" rounded text raised size="small"
          icon={isFullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand"}
          tooltip={isFullscreen ? "화면 축소" : "전체화면"}
          tooltipOptions={{ position: 'left' }}
          onClick={toggleFullscreen}
        >
        </Button>
        <Button className="theme" icon="pi pi-palette" severity="secondary" rounded text raised size="small"
          tooltip="테마"
          tooltipOptions={{ position: 'left' }}
          onClick={onThemeClick}
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

