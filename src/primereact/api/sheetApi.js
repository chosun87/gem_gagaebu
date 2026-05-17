import { GOOGLE_SHEET } from '@/assets/js/constants'

// gapi sheets 클라이언트와 spreadsheetId를 한 곳에서 관리
const getSheets = () => window.gapi.client.sheets.spreadsheets
const SPREADSHEET_ID = GOOGLE_SHEET.SPREADSHEET_ID

// 삭제 마킹용 컬럼 문자 계산 (colIndex → 'A', 'B', …)
const colLetter = (colIndex) =>
  String.fromCharCode('A'.charCodeAt(0) + colIndex)

// 특정 행에 삭제 타임스탬프를 기록합니다. (소프트 삭제)
export const markSheetRowDeleted = async (sheetName, rowNo, colIndex) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19)
  return updateSheetCell(
    `${sheetName}!${colLetter(colIndex)}${rowNo}`,
    timestamp,
  )
}

// 특정 범위의 데이터를 가져옵니다. (ex: '2026!A:G')
export const fetchSheetData = async (range) => {
  try {
    const response = await getSheets().values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    })
    return response.result.values || []
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    throw error
  }
}

// 특정 셀의 데이터를 업데이트합니다. (ex: range='2026!A3', value=TRUE)
export const updateSheetCell = async (range, value) => {
  try {
    const response = await getSheets().values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[value]] },
    })
    return response.result
  } catch (error) {
    console.error('Error updating sheet cell:', error)
    throw error
  }
}

// 특정 시트의 마지막에 행을 추가합니다.
export const appendSheetRow = async (sheetName, values) => {
  try {
    const response = await getSheets().values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [values] },
    })
    return response.result
  } catch (error) {
    console.error('Error appending sheet row:', error)
    throw error
  }
}

// 특정 시트의 마지막에 여러 행을 한 번에 추가합니다.
export const appendSheetRows = async (sheetName, rowsArray) => {
  if (!rowsArray || rowsArray.length === 0) return null
  try {
    const response = await getSheets().values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: rowsArray },
    })
    return response.result
  } catch (error) {
    console.error('Error appending sheet rows:', error)
    throw error
  }
}

// 특정 행의 데이터를 업데이트합니다.
export const updateSheetRow = async (sheetName, rowNo, values) => {
  try {
    const response = await getSheets().values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowNo}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    })
    return response.result
  } catch (error) {
    console.error('Error updating sheet row:', error)
    throw error
  }
}

// 새로운 시트를 생성합니다.
export const createSheet = async (sheetName) => {
  try {
    const response = await getSheets().batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      },
    })
    return response.result
  } catch (error) {
    // 이미 시트가 존재하는 경우(400 에러) 등은 무시하거나 별도 처리 가능
    console.error('Error creating sheet:', error)
    throw error
  }
}

// 시트의 헤더(1행)를 초기화합니다.
export const updateSheetHeaders = async (sheetName, headers) => {
  try {
    const response = await getSheets().values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!1:1`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [headers] },
    })
    return response.result
  } catch (error) {
    console.error('Error updating sheet headers:', error)
    throw error
  }
}

// 여러 셀/범위의 데이터를 한 번에 업데이트합니다.
export const batchUpdateSheetValues = async (dataArray) => {
  if (!dataArray || dataArray.length === 0) return null
  // dataArray 구조: [{ range: '시트!A1', values: [[값]] }, ...]
  try {
    const response = await getSheets().values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: dataArray,
      },
    })
    return response.result
  } catch (error) {
    console.error('Error batch updating sheet values:', error)
    throw error
  }
}
