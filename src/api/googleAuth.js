import { gapi } from 'gapi-script';

const CLIENT_ID = '660525556283-dtpdooehas3u161nsstn2l4hufvndhpr.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

let tokenClient = null;

// GAPI 클라이언트만 초기화 (auth2 제외)
export const initGoogleApi = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          plugin_name: "gagaebu"
        });
        resolve();
      } catch (error) {
        console.error('Error initializing GAPI client', error);
        reject(error);
      }
    });
  });
};

// GIS 스크립트 로드 및 TokenClient 초기화
export const initGoogleAuth = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // signIn() 에서 동적으로 덮어씀
      });
      resolve();
    };
    document.body.appendChild(script);
  });
};

// 토큰 발급 및 GAPI 적용
export const signIn = () => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Token client not initialized'));
      return;
    }
    
    tokenClient.callback = (tokenResponse) => {
      if (tokenResponse.error) {
        reject(tokenResponse);
      } else {
        // 발급받은 토큰을 gapi에 주입하여 API 호출이 가능하게 함
        gapi.client.setToken({ access_token: tokenResponse.access_token });
        resolve(tokenResponse);
      }
    };
    
    // 팝업 트리거
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
};

// 새로고침 시 이전에 보관해둔 토큰 주입용
export const setToken = (token) => {
  if (gapi && gapi.client) {
    gapi.client.setToken({ access_token: token });
  }
};

// 로그아웃 및 토큰 권한 취소
export const signOut = () => {
  return new Promise((resolve) => {
    const token = gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken('');
        resolve();
      });
    } else {
      resolve();
    }
  });
};
