import { useRef, useCallback } from 'react';
import { useAuth, useAuthTimer } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Button, confirmDialog } from '@/assets/js/PrimeReact';
import { toggleFullscreen, useFullscreenStatus } from '@/assets/js/Fullscreen';
import { GOOGLE_AUTH_PARAMS } from '@/assets/js/googleAuthParams';

function useLongPress(onClick, onLongPress, delay = 600) {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const startPress = useCallback(
    (e) => {
      isLongPress.current = false;
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress(e);
      }, delay);
    },
    [onLongPress, delay],
  );

  const endPress = useCallback(
    (e) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (!isLongPress.current) {
        onClick(e);
      }
    },
    [onClick],
  );

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    onMouseDown: startPress,
    onMouseUp: endPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: endPress,
    onContextMenu: (e) => e.preventDefault(),
  };
}

export default function Header({ onThemeClick }) {
  const { isInitialized, isSignedIn, login, logout, extendLogin } = useAuth();
  const { authRemainingTime } = useAuthTimer();
  const isFullscreen = useFullscreenStatus();
  const { reloadData, loading } = useData();

  // Functions -------------------------------------------------------------------------------------
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

  const fnHardReload = () => {
    confirmDialog({
      message: (
        <>
          페이지를 완전히 새로고침 하시겠습니까?
          <br />
          작업 중인 내용이 초기화됩니다.
        </>
      ),
      header: '완전 새로고침 확인',
      icon: 'pi pi-refresh',
      acceptLabel: '새로고침',
      rejectLabel: '취소',
      accept: () => window.location.reload(),
    });
  };

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const handlersPressRefresh = useLongPress(
    () => reloadData(),
    () => fnHardReload(),
  );

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <header className="app-header">
      <h1 className="app-header-title text-4xl">
        <img
          className="app-header-logo"
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt="Logo"
        />
        가계부
      </h1>

      <div className="app-header-version">
        v.{import.meta.env.VITE_APP_VERSION}
      </div>

      <div className="app-header-buttons">
        <Button
          className="fullscreen text-base"
          severity="info"
          rounded
          text
          raised
          size="small"
          icon={isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'}
          tooltip={isFullscreen ? '화면 축소' : '전체화면'}
          tooltipOptions={{ position: 'left' }}
          onClick={toggleFullscreen}
        />
        <Button
          className="theme text-base"
          severity="info"
          rounded
          text
          raised
          size="small"
          icon="pi pi-palette"
          tooltip="테마"
          tooltipOptions={{ position: 'left' }}
          onClick={onThemeClick}
        />

        {isSignedIn ? (
          <>
            <Button
              className="refresh text-base"
              severity="info"
              rounded
              text
              raised
              size="small"
              icon={loading ? 'pi pi-spin pi-refresh' : 'pi pi-refresh'}
              disabled={!isInitialized || loading}
              tooltip="새로고침 (길게 누르면 완전 새로고침)"
              tooltipOptions={{ position: 'left' }}
              {...handlersPressRefresh}
            />
            <div className="flex flex-column align-items-center relative">
              {/* 인증만료까지 남은 시간 표시 (클릭 시 연장) */}
              {!GOOGLE_AUTH_PARAMS.DISABLED_RELOGIN && (
                <span
                  className="auth-remaining-time text-xs monospace"
                  style={{ cursor: 'pointer' }}
                  onClick={extendLogin}
                  title="인증 연장하기"
                >
                  {authRemainingTime}
                </span>
              )}

              {/* 로그아웃 버튼 */}
              <Button
                className="login text-base"
                severity="primary"
                rounded
                text
                raised
                size="small"
                icon="pi pi-sign-out"
                disabled={!isInitialized}
                tooltip="로그아웃"
                tooltipOptions={{ position: 'left' }}
                onClick={fnLogout}
              />
            </div>
          </>
        ) : (
          <Button
            className="login text-base"
            severity="primary"
            rounded
            text
            raised
            size="small"
            icon="pi pi-user"
            disabled={!isInitialized}
            tooltip="로그인"
            tooltipOptions={{ position: 'left' }}
            onClick={login}
          />
        )}
      </div>
    </header>
  );
}
