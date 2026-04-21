import { gapi } from 'gapi-script';
import { GOOGLE_SHEET } from '@/assets/js/constants';

// 특정 범위의 데이터를 가져옵니다. (ex: '2026!A:G')
export const fetchSheetData = async (range) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET.SPREADSHEET_ID,
      range: range,
    });
    return response.result.values || [];
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};

// 특정 셀의 데이터를 업데이트합니다. (ex: range='2026!A3', value=TRUE)
export const updateSheetCell = async (range, value) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET.SPREADSHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[value]]
      }
    });
    return response.result;
  } catch (error) {
    console.error('Error updating sheet cell:', error);
    throw error;
  }
};

// 특정 시트의 마지막에 행을 추가합니다.
export const appendSheetRow = async (sheetName, values) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET.SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values]
      }
    });
    return response.result;
  } catch (error) {
    console.error('Error appending sheet row:', error);
    throw error;
  }
};

// 특정 행의 데이터를 업데이트합니다.
export const updateSheetRow = async (sheetName, rowNo, values) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET.SPREADSHEET_ID,
      range: `${sheetName}!A${rowNo}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [values]
      }
    });
    return response.result;
  } catch (error) {
    console.error('Error updating sheet row:', error);
    throw error;
  }
};

// 새로운 시트를 생성합니다.
export const createSheet = async (sheetName) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_SHEET.SPREADSHEET_ID,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }
        ]
      }
    });
    return response.result;
  } catch (error) {
    // 이미 시트가 존재하는 경우(400 에러) 등은 무시하거나 별도 처리 가능
    console.error('Error creating sheet:', error);
    throw error;
  }
};

// 시트의 헤더(1행)를 초기화합니다.
export const updateSheetHeaders = async (sheetName, headers) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET.SPREADSHEET_ID,
      range: `${sheetName}!1:1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [headers]
      }
    });
    return response.result;
  } catch (error) {
    console.error('Error updating sheet headers:', error);
    throw error;
  }
};

