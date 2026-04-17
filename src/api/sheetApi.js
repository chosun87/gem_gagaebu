import { gapi } from 'gapi-script';

export const SPREADSHEET_ID = '1LsFDmpmPaPCPXPBl1FS8CXx56UqGE0WQ5eFccwYeWcE';

// 특정 범위의 데이터를 가져옵니다. (ex: '2026!A:G')
export const fetchSheetData = async (range) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
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
      spreadsheetId: SPREADSHEET_ID,
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

