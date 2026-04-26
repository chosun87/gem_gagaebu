import { useAuth } from '@/context/AuthContext';
import { Button, confirmDialog } from '@/assets/js/PrimeReact';
import { toggleFullscreen, useFullscreenStatus } from '@/assets/js/Fullscreen';

export default function Header({ onThemeClick }) {
  const { isInitialized, isSignedIn, login, logout, extendLogin, authRemainingTime } = useAuth();
  const isFullscreen = useFullscreenStatus();

  const fnLogout = () => {
    confirmDialog({
      message: '로그아웃 하시겠습니까?',
      header: '로그아웃 확인',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '로그아웃',
      rejectLabel: '취소',
      accept: () => logout(),
    });
  };

  return (
    <header className="app-header shadow-2">
      <h1 className="app-header-title text-4xl">
        <img className="app-header-logo" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Logo" />
        가계부
      </h1>

      <div className="app-header-buttons">
        <Button className="fullscreen text-base" severity="info" rounded text raised size="small"
          icon={isFullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand"}
          tooltip={isFullscreen ? "화면 축소" : "전체화면"} tooltipOptions={{ position: 'left' }}
          onClick={toggleFullscreen}
        />
        <Button className="theme text-base" severity="info" rounded text raised size="small"
          icon="pi pi-palette"
          tooltip="테마" tooltipOptions={{ position: 'left' }}
          onClick={onThemeClick}
        />

        {isSignedIn ? (
          <>
            <Button className="refresh text-base" severity="info" rounded text raised size="small"
              icon="pi pi-refresh"
              disabled={!isInitialized}
              tooltip="새로고침" tooltipOptions={{ position: 'left' }}
            />
            <div className="flex flex-column align-items-center relative">
              {/* 인증만료까지 남은 시간 표시 (클릭 시 연장) */}
              <span className="auth-remaining-time text-xs monospace"
                style={{ cursor: 'pointer' }}
                onClick={extendLogin}
                title="인증 연장하기"
              >
                {authRemainingTime}
              </span>

              {/* 로그아웃 버튼 */}
              <Button className="login text-base" severity="primary" rounded text raised size="small"
                icon="pi pi-sign-out"
                disabled={!isInitialized}
                tooltip="로그아웃" tooltipOptions={{ position: 'left' }}
                onClick={fnLogout}
              />
            </div>
          </>
        ) : (
          <Button className="login text-base" severity="primary" rounded text raised size="small"
            icon="pi pi-user"
            disabled={!isInitialized}
            tooltip="로그인" tooltipOptions={{ position: 'left' }}
            onClick={login}
          />
        )}
      </div>
    </header>
  );
}

