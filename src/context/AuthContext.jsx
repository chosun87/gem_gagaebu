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
