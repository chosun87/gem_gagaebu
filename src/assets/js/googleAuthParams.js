export const GOOGLE_AUTH_PARAMS = {
  SRC: 'https://accounts.google.com/gsi/client',
  CLIENT_ID: '660525556283-dtpdooehas3u161nsstn2l4hufvndhpr.apps.googleusercontent.com',
  TOKEN_EXPIRY_MIN: 6,   // 구글 api에서 토큰을 리프레쉬하는 시간: 최대 60분
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
  DISCOVERY_DOCS: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  REDIRECT_URI: "https://chosun87.github.io/gem_gagaebu",
}
