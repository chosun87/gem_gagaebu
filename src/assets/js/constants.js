
export const GOOGLE_AUTH = {
  SRC: 'https://accounts.google.com/gsi/client',
  CLIENT_ID: '660525556283-dtpdooehas3u161nsstn2l4hufvndhpr.apps.googleusercontent.com',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
  DISCOVERY_DOCS: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
}

export const GOOGLE_SHEET = {
  SPREADSHEET_ID: '1LsFDmpmPaPCPXPBl1FS8CXx56UqGE0WQ5eFccwYeWcE'
}

export const SHEET_NAME_RANGE = {
  CODE: '코드!A1:F',
  ASSET: '자산!A1:F',
  REPEAT: '반복!A1:K',
  YEAR: 'YYYY!A1:I'
}

export const SHEET_COL_INDEX = {
  // 코드 시트 컬럼 인덱스
  codeGroup: 0,
  code: 1,
  codeLabel: 2,
  codeIcon: 3,
  codeOrder: 4,
  codeMemo: 5,

  // 자산 시트 컬럼 인덱스
  accType: 0,
  accCode: 1,
  accLabel: 2,
  accIcon: 3,
  accOrder: 4,
  accMemo: 5,

  // 반복 시트 컬럼 인덱스
  rpID: 0,
  rpDateS: 1,
  rpDateE: 2,
  rpDay: 3,
  rpComplete: 4,
  rpType: 5,
  rpAcc1: 6,
  rpAcc2: 7,
  rpCategory: 8,
  rpAmount: 9,
  rpMemo: 10,

  // 연도 시트 컬럼 인덱스
  gDate: 0,
  gType: 1,
  gAcc1: 2,
  gAcc2: 3,
  gCategory: 4,
  gAmount: 5,
  gMemo: 6,
  gExecuted: 7,
  g_rpID: 8,
}
