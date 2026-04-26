import { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { initGoogleApi, signOut, setToken } from '@/api/googleAuth';
import { GOOGLE_AUTH } from '@/assets/js/google_api';

const AuthContext = createContext(null);

const AuthInternalProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const expiresIn = tokenResponse.expires_in * 1000;
      localStorage.setItem('gagaebu_token', tokenResponse.access_token);
      localStorage.setItem('gagaebu_token_expiry', Date.now() + expiresIn - 60000);

      setToken(tokenResponse.access_token);
      setIsSignedIn(true);
    },
    onError: (error) => console.error('Login Failed:', error),
    scope: GOOGLE_AUTH.SCOPES,
  });

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

  const login = () => {
    googleLogin();
  };

  const [authRemainingTime, setAuthRemainingTime] = useState(0);

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

  // 인증 만료 시 자동 로그아웃 처리 및 남은 시간 업데이트
  useEffect(() => {
    let timerId;
    let intervalId;

    if (isSignedIn) {
      const updateRemainingTime = () => {
        const tokenExpiry = localStorage.getItem('gagaebu_token_expiry');
        if (tokenExpiry) {
          const remaining = Math.max(0, Math.floor((Number(tokenExpiry) - Date.now()) / 1000));
          setAuthRemainingTime(remaining);

          if (remaining <= 0) {
            alert('인증 기간이 만료되어 자동으로 로그아웃 처리되었습니다.\n다시 로그인해 주세요.');
            logout();
          }
        }
      };

      updateRemainingTime();
      intervalId = setInterval(updateRemainingTime, 1000);
    } else {
      setAuthRemainingTime(0);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isSignedIn]);

  // 초 단위를 MM:SS 형식으로 변환
  const formatRemainingTime = (seconds) => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <AuthContext.Provider value={{
      isInitialized,
      isSignedIn,
      login,
      logout,
      authRemainingTime: formatRemainingTime(authRemainingTime)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_AUTH.CLIENT_ID}>
      <AuthInternalProvider>
        {children}
      </AuthInternalProvider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
