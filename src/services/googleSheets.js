import { gapi } from 'gapi-script';

export const SPREADSHEET_ID = '1LsFDmpmPaPCPXPBl1FS8CXx56UqGE0WQ5eFccwYeWcE';

/**
 * GAPI 클라이언트 로드 및 초기화 (토큰 주입)
 */
const ensureGapi = (accessToken) => {
  return new Promise((resolve, reject) => {
    if (gapi.client && gapi.client.sheets) {
      gapi.client.setToken({ access_token: accessToken });
      resolve();
    } else {
      gapi.load('client', () => {
        gapi.client
          .init({
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          })
          .then(() => {
            gapi.client.setToken({ access_token: accessToken });
            resolve();
          })
          .catch(reject);
      });
    }
  });
};

/**
 * 스프레드시트 메타데이터 가져오기 (예: 전체 시트 목록)
 */
export const fetchSpreadsheetMetadata = async (accessToken) => {
  await ensureGapi(accessToken);
  try {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    return response.result;
  } catch (err) {
    if (err.result?.error?.code === 401) throw new Error('401 Unauthorized');
    throw err;
  }
};

/**
 * 특정 시트의 전체 데이터 가져오기
 */
export const fetchSheetData = async (accessToken, sheetName) => {
  await ensureGapi(accessToken);
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });
    return response.result.values || [];
  } catch (err) {
    if (err.result?.error?.code === 401) throw new Error('401 Unauthorized');
    throw err;
  }
};

/**
 * 특정 시트의 마지막에 데이터 1줄(Row) 추가하기
 */
export const appendSheetData = async (accessToken, sheetName, rowData) => {
  await ensureGapi(accessToken);
  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });
    return response.result;
  } catch (err) {
    if (err.result?.error?.code === 401) throw new Error('401 Unauthorized');
    throw err;
  }
};
