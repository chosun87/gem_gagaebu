// Google Sheets 관련
export const GOOGLE_SHEET = {
  SPREADSHEET_ID: '1LsFDmpmPaPCPXPBl1FS8CXx56UqGE0WQ5eFccwYeWcE'
}

// Google Sheets 시트 이름과 범위
export const SHEET_NAME_RANGE = {
  CODE: '코드!A1:H',
  ASSET: '자산!A1:H',
  REPEAT: '반복!A1:N',
  YEAR: 'YYYY!A1:J'
}

// Google Sheets 시트 컬럼 인덱스
export const SHEET_COL_INDEX = {
  // 코드 시트 컬럼 인덱스
  CODE: {
    cdGroup: 0,
    cd: 1,
    cdLabel: 2,
    cdIcon: 3,
    cdOrder: 4,
    cdMemo: 5,
    cdDefaultAcc1: 6,
    cdDeleted: 7,
  },

  // 자산 시트 컬럼 인덱스
  ASSET: {
    accType: 0,
    accCode: 1,
    accLabel: 2,
    accIcon: 3,
    accDefault: 4,
    accOrder: 5,
    accMemo: 6,
    accDeleted: 7,
  },

  // 반복 시트 컬럼 인덱스
  REPEAT: {
    rpID: 0,
    rpDateS: 1,
    rpDateE: 2,
    rpPeriod: 3,
    rpDay: 4,
    rpCompleted: 5,
    rpType: 6,
    rpAcc1: 7,
    rpAcc2: 8,
    rpCategory: 9,
    rpAmount: 10,
    rpTotalAmount: 11,
    rpMemo: 12,
    rpDeleted: 13,
  },

  // 연도 시트 컬럼 인덱스
  YYYY: {
    gDate: 0,
    gType: 1,
    gAcc1: 2,
    gAcc2: 3,
    gCategory: 4,
    gAmount: 5,
    gMemo: 6,
    gExecuted: 7,
    g_rpID: 8,
    gDeleted: 9,
  }
}

// 거래 유형
export const G_TYPE = {
  수입: { label: '수입', value: '수입' },
  지출: { label: '지출', value: '지출' },
  이체: { label: '이체', value: '이체' }
}

// 반복 거래 유형
export const RP_TYPE = {
  수입: { label: '수입', value: '수입' },
  지출: { label: '지출', value: '지출' },
  이체: { label: '이체', value: '이체' }
}
