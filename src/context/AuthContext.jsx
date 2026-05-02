import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { initGoogleApi, signOut, setToken } from '@/api/googleAuth';
import { GOOGLE_AUTH_PARAMS } from '@/assets/js/googleAuthParams';
import { confirmDialog } from '@/assets/js/PrimeReact';

const AuthContext = createContext(null);
const AuthTimerContext = createContext(null);

const AuthInternalProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authRemainingTime, setAuthRemainingTime] = useState(0);
  const [extensionPromptShown, setExtensionPromptShown] = useState(false);

  // 이전 로그인 상태 추적 (렌더링 중 상태 조정하여 cascading renders 방지)
  const [prevIsSignedIn, setPrevIsSignedIn] = useState(isSignedIn);

  if (isSignedIn !== prevIsSignedIn) {
    setPrevIsSignedIn(isSignedIn);
    if (!isSignedIn) {
      setAuthRemainingTime(0);
      setExtensionPromptShown(false);
    }
  }

  useEffect(() => {
    const setup = async () => {
      try {
        // GAPI 초기화 (index.html에서 로드됨)
        await initGoogleApi();

        const storedToken = localStorage.getItem('gagaebu_token');
        const tokenExpiry = localStorage.getItem('gagaebu_token_expiry');

        if (storedToken && tokenExpiry && Date.now() < Number(tokenExpiry)) {
          setToken(storedToken);
          setIsSignedIn(true);
        } else {
          localStorage.removeItem('gagaebu_token');
          localStorage.removeItem('gagaebu_token_expiry');
        }

        setIsInitialized(true);
      } catch (err) {
        console.error('Google setup failed', err);
        setIsInitialized(true);
      }
    };

    setup();
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const sessionMs = GOOGLE_AUTH_PARAMS.TOKEN_EXPIRY_MIN * 60 * 1000;
      localStorage.setItem('gagaebu_token', tokenResponse.access_token);
      localStorage.setItem('gagaebu_token_expiry', Date.now() + sessionMs);

      setToken(tokenResponse.access_token);
      setIsSignedIn(true);
      setExtensionPromptShown(false);
    },
    onError: (error) => console.error('Login Failed:', error),
    scope: GOOGLE_AUTH_PARAMS.SCOPES,
  });

  const login = useCallback(() => {
    googleLogin();
  }, [googleLogin]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      localStorage.removeItem('gagaebu_token');
      localStorage.removeItem('gagaebu_token_expiry');
      setIsSignedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const extendLogin = useCallback(() => {
    googleLogin();
  }, [googleLogin]);

  // 인증 만료 시 자동 로그아웃 처리 및 남은 시간 업데이트
  useEffect(() => {
    let intervalId;

    if (isSignedIn) {
      const updateRemainingTime = () => {
        const tokenExpiry = localStorage.getItem('gagaebu_token_expiry');
        if (tokenExpiry) {
          const remaining = Math.max(
            0,
            Math.floor((Number(tokenExpiry) - Date.now()) / 1000),
          );
          setAuthRemainingTime(remaining);

          // 3분(180초) 남았을 때 연장 여부 확인
          if (remaining === 180 && !extensionPromptShown) {
            setExtensionPromptShown(true);
            confirmDialog({
              message: '인증 만료 3분 전입니다. 로그인을 연장하시겠습니까?',
              header: '로그인 연장 알림',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: '연장하기',
              rejectLabel: '나중에',
              accept: () => {
                extendLogin();
              },
            });
          }

          if (remaining <= 0) {
            if (intervalId) clearInterval(intervalId);

            const currentToken = localStorage.getItem('gagaebu_token');
            if (!currentToken) return;

            logout();

            alert(
              '인증 기간이 만료되어 자동으로 로그아웃 처리되었습니다.\n다시 로그인해 주세요.',
            );
          }
        }
      };

      updateRemainingTime();
      if (!GOOGLE_AUTH_PARAMS.DISABLED_RELOGIN) {
        intervalId = setInterval(updateRemainingTime, 1000);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSignedIn, extensionPromptShown, extendLogin, logout]);

  // 초 단위를 MM:SS 형식으로 변환
  const formatRemainingTime = (seconds) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const authValue = useMemo(
    () => ({
      isInitialized,
      isSignedIn,
      login,
      logout,
      extendLogin,
    }),
    [isInitialized, isSignedIn, login, logout, extendLogin],
  );

  const timerValue = useMemo(
    () => ({
      authRemainingTime: formatRemainingTime(authRemainingTime),
    }),
    [authRemainingTime],
  );

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <AuthContext.Provider value={authValue}>
      <AuthTimerContext.Provider value={timerValue}>
        {children}
      </AuthTimerContext.Provider>
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_PARAMS.CLIENT_ID}>
      <AuthInternalProvider>{children}</AuthInternalProvider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useAuthTimer = () => useContext(AuthTimerContext);
