// Google Sheets 관련
export const GOOGLE_SHEET = {
  SPREADSHEET_ID: import.meta.env.DEV
    ? import.meta.env.VITE_GOOGLE_SPREADSHEET_ID_DEV
    : import.meta.env.VITE_GOOGLE_SPREADSHEET_ID_PROD,
};

// Google Sheets 시트 이름과 범위
export const SHEET_NAME_RANGE = {
  CODE: '코드!A1:J',
  ASSET: '자산!A1:J',
  REPEAT: '반복!A1:O',
  YEAR: 'YYYY!A1:K',
};

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
    cdAddSum: 7,
    cdDeleted: 8,
    cdTimestamp: 9,
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
    accUnused: 7,
    accDeleted: 8,
    accTimestamp: 9,
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
    rpTimestamp: 14,
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
    gTimestamp: 10,
  },
};

export const TRANSACTION_TYPE = {
  INCOME: '수입',
  EXPENSE: '지출',
  TRANSFER: '이체',
  DEPOSIT: '입금',
  WITHDRAW: '출금',
  REVENUE: '수익',
};

export const REPEAT_PERIOD = {
  MONTHLY: 'M',
  WEEKLY: 'W',
};

// 거래 유형 (UI 바인딩용)
export const G_TYPE = {
  수입: { label: TRANSACTION_TYPE.INCOME, value: TRANSACTION_TYPE.INCOME },
  지출: { label: TRANSACTION_TYPE.EXPENSE, value: TRANSACTION_TYPE.EXPENSE },
  이체: { label: TRANSACTION_TYPE.TRANSFER, value: TRANSACTION_TYPE.TRANSFER },
};

// 반복 거래 유형
export const RP_TYPE = {
  수입: { label: TRANSACTION_TYPE.INCOME, value: TRANSACTION_TYPE.INCOME },
  지출: { label: TRANSACTION_TYPE.EXPENSE, value: TRANSACTION_TYPE.EXPENSE },
  이체: { label: TRANSACTION_TYPE.TRANSFER, value: TRANSACTION_TYPE.TRANSFER },
};
