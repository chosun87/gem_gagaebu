import { createContext, useContext, useState, useEffect } from 'react';
import { initGoogleApi, initGoogleAuth, signIn, signOut, setToken } from '@/api/googleAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        // GAPI 및 GIS 각각 비동기 초기화
        await initGoogleApi();
        await initGoogleAuth();

        // 로컬 스토리지에 저장된 토큰이 있는지, 만료되지는 않았는지 검사
        const storedToken = localStorage.getItem('gagaebu_token');
        const tokenExpiry = localStorage.getItem('gagaebu_token_expiry');

        if (storedToken && tokenExpiry && Date.now() < Number(tokenExpiry)) {
          setToken(storedToken); // GAPI에 기존 토큰 주입
          setIsSignedIn(true);
        } else {
          // 토큰이 만료되었거나 없으면 삭제
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

  const login = async () => {
    try {
      const response = await signIn();
      // 발급받은 토큰은 보통 3599초(약 1시간) 동안 유효함
      const expiresIn = response.expires_in * 1000;

      localStorage.setItem('gagaebu_token', response.access_token);
      // 안전하게 만료 1분 전에 만료되었다고 간주하도록 설정
      localStorage.setItem('gagaebu_token_expiry', Date.now() + expiresIn - 60000);

      setIsSignedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
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

  return (
    <AuthContext.Provider value={{ isInitialized, isSignedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
