import { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { initGoogleApi, signOut, setToken } from '@/api/googleAuth';
import { GOOGLE_AUTH_PARAMS } from '@/assets/js/googleAuthParams';
import { confirmDialog } from '@/assets/js/PrimeReact';

const AuthContext = createContext(null);

const AuthInternalProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authRemainingTime, setAuthRemainingTime] = useState(0);
  const [extensionPromptShown, setExtensionPromptShown] = useState(false);

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

  // 인증 만료 시 자동 로그아웃 처리 및 남은 시간 업데이트
  useEffect(() => {
    let intervalId;

    if (isSignedIn) {
      const updateRemainingTime = () => {
        const tokenExpiry = localStorage.getItem('gagaebu_token_expiry');
        if (tokenExpiry) {
          const remaining = Math.max(0, Math.floor((Number(tokenExpiry) - Date.now()) / 1000));
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
              }
            });
          }

          if (remaining <= 0) {
            // 타이머 중복 실행 방지를 위해 즉시 해제
            if (intervalId) clearInterval(intervalId);

            // 이미 로그아웃 처리 중이면 중단
            const currentToken = localStorage.getItem('gagaebu_token');
            if (!currentToken) return;

            alert('인증 기간이 만료되어 자동으로 로그아웃 처리되었습니다.\n다시 로그인해 주세요.');
            logout();
          }
        }
      };

      updateRemainingTime();
      intervalId = setInterval(updateRemainingTime, 1000);
    } else {
      setAuthRemainingTime(0);
      setExtensionPromptShown(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSignedIn, extensionPromptShown]);

  // 초 단위를 MM:SS 형식으로 변환
  const formatRemainingTime = (seconds) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };


  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // 구글 토큰 자체의 만료 시간과 관계없이, 설정된 TOKEN_EXPIRY_MIN 분을 세션 유지 시간으로 사용
      const sessionMs = GOOGLE_AUTH_PARAMS.TOKEN_EXPIRY_MIN * 60 * 1000;
      localStorage.setItem('gagaebu_token', tokenResponse.access_token);
      localStorage.setItem('gagaebu_token_expiry', Date.now() + sessionMs);

      setToken(tokenResponse.access_token);
      setIsSignedIn(true);
      setExtensionPromptShown(false); // 토큰 갱신 시 프롬프트 상태 초기화
    },
    onError: (error) => console.error('Login Failed:', error),
    scope: GOOGLE_AUTH_PARAMS.SCOPES,
  });

  const login = () => {
    googleLogin();
  };

  const logout = async () => {
    try {
      await signOut();
      localStorage.removeItem('gagaebu_token');
      localStorage.removeItem('gagaebu_token_expiry');
      setIsSignedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const extendLogin = () => {
    googleLogin();
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <AuthContext.Provider value={{
      isInitialized,
      isSignedIn,
      login,
      logout,
      extendLogin,
      authRemainingTime: formatRemainingTime(authRemainingTime)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_AUTH_PARAMS.CLIENT_ID}>
      <AuthInternalProvider>
        {children}
      </AuthInternalProvider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
