export const GOOGLE_AUTH_PARAMS = {
  SRC: 'https://accounts.google.com/gsi/client',
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
  DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  REDIRECT_URI: 'https://chosun87.github.io/gem_gagaebu',

  // 인증 관련
  TOKEN_KEY: 'gagaebu_token',
  EXPIRY_KEY: 'gagaebu_token_expiry',
  EXTENSION_THRESHOLD_SEC: 180, // 3분 전
  TOKEN_EXPIRY_MIN: 60, // 구글 api에서 토큰을 리프레쉬하는 시간: 최대 60분
  DISABLED_RELOGIN: false, // 재로그인 비활성화
}
