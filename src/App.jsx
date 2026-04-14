import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { fetchSpreadsheetMetadata, fetchSheetData, appendSheetData } from './services/googleSheets';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('gagaebu_access_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data State
  const [activeYearSheet, setActiveYearSheet] = useState(null);
  const [records, setRecords] = useState([]);
  const [headers, setHeaders] = useState([]);
  
  // Meta Data State
  const [assets, setAssets] = useState([]);
  const [codes, setCodes] = useState([]);

  // Form State
  const [type, setType] = useState('지출'); // 수입, 지출, 이체
  const [date, setDate] = useState(new Date());
  const [assetAccount, setAssetAccount] = useState('');
  const [transferTargetAccount, setTransferTargetAccount] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(null);
  const [content, setContent] = useState('');

  const typeOptions = ['수입', '지출', '이체'];

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const { access_token } = tokenResponse;
      localStorage.setItem('gagaebu_access_token', access_token);
      setToken(access_token);
      setError('');
    },
    onError: (err) => {
      console.error('Login Failed', err);
      setError('Google 로그인에 실패했습니다.');
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const logout = () => {
    localStorage.removeItem('gagaebu_access_token');
    setToken(null);
    setRecords([]);
  };

  const loadAllData = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      // 1. Get metadata to find the latest year sheet
      const meta = await fetchSpreadsheetMetadata(token);
      const sheetTitles = meta.sheets.map(s => s.properties.title);
      
      // Filter numeric sheets (e.g., "2024", "2025")
      const yearSheets = sheetTitles.filter(title => !isNaN(title));
      if (yearSheets.length === 0) {
        throw new Error('연도 시트를 찾을 수 없습니다.');
      }
      // Sort descending and pick the largest year
      yearSheets.sort((a, b) => Number(b) - Number(a));
      const latestYear = yearSheets[0];
      setActiveYearSheet(latestYear);

      // 2. Load year data, assets, and codes concurrently
      const [yearData, assetData, codeData] = await Promise.all([
        fetchSheetData(token, latestYear),
        fetchSheetData(token, '자산').catch(() => []), // Ignore if absent temporarily
        fetchSheetData(token, '코드').catch(() => []),
      ]);

      if (yearData && yearData.length > 0) {
        setHeaders(yearData[0] || []);
        // Ignore the first header row for the datatable records
        setRecords(yearData.slice(1).map((row, index) => {
          let rowObj = { _id: index };
          yearData[0].forEach((head, i) => {
            rowObj[head] = row[i] || '';
          });
          return rowObj;
        }));
      } else {
        setHeaders([]);
        setRecords([]);
      }

      // Parse assets (skip header)
      if (assetData.length > 1) {
        setAssets(assetData.slice(1).map(row => row[0])); // Assumes column A is account name
      }
      
      // Parse codes (skip header)
      if (codeData.length > 1) {
        // Assuming: [코드구분(수입/지출), 코드, 명칭, 비고]
        const parsedCodes = codeData.slice(1).map(row => ({
          type: row[0],
          code: row[1],
          name: row[2],
        }));
        setCodes(parsedCodes);
      }

    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes('401')) {
        logout(); // Token expired probably
        setError('세션이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        setError('데이터를 불러오는데 실패했습니다: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const handleAddSubmit = async () => {
    if (!token || !activeYearSheet) return;
    
    // Validate required fields
    if (!amount || !content || !assetAccount) {
      setError('금액, 내용, 계정은 필수 입력입니다.');
      return;
    }
    
    if (type !== '이체' && !category) {
      setError('분류를 선택해주세요.');
      return;
    }
    
    if (type === '이체' && !transferTargetAccount) {
      setError('입금계좌를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Create Row to append
      // This mapping heavily depends on the actual column order. 
      // Assuming a generic order here, but ideally we map according to headers.
      // E.g. [날짜, 구분, 자산(계좌/출금), 분류(입금), 금액, 내용]
      let rowData = [];
      
      const dateStr = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
      
      // If headers are known, let's map by header names (fallback to index based if exact match fails)
      const mappedRow = Array(headers.length).fill('');
      
      const getFieldPos = (names) => {
        for (let n of names) {
          const idx = headers.findIndex(h => h.includes(n));
          if (idx !== -1) return idx;
        }
        return -1;
      };

      const datePos = getFieldPos(['날짜', '일자']);
      const typePos = getFieldPos(['구분', '종류']);
      const assetPos = getFieldPos(['자산', '출금', '계좌']);
      const catPos = getFieldPos(['분류', '입금']);
      const amtPos = getFieldPos(['금액', '돈']);
      const namePos = getFieldPos(['내용', '적요']);

      if (datePos > -1) mappedRow[datePos] = dateStr;
      if (typePos > -1) mappedRow[typePos] = type;
      if (assetPos > -1) mappedRow[assetPos] = assetAccount;
      if (catPos > -1) mappedRow[catPos] = type === '이체' ? transferTargetAccount : category;
      if (amtPos > -1) mappedRow[amtPos] = amount.toString();
      if (namePos > -1) mappedRow[namePos] = content;

      // In case headers are empty or unknown, fallback to a strict array
      const finalRow = headers.length > 0 ? mappedRow : [dateStr, type, assetAccount, type === '이체' ? transferTargetAccount : category, amount.toString(), content];

      await appendSheetData(token, activeYearSheet, finalRow);
      
      // Reset form
      setAmount(null);
      setContent('');
      
      // Reload Data
      await loadAllData();
      
    } catch (err) {
      console.error(err);
      setError('데이터 추가에 실패했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCodes = codes.filter(c => type.includes(c.type));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>gem_gagaebu</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {token && <Button icon="pi pi-refresh" label="새로고침" onClick={loadAllData} disabled={loading} />}
          {token && <Button icon="pi pi-sign-out" severity="secondary" outlined title="로그아웃" onClick={logout} />}
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#ffebee', border: '1px solid #ef9a9a' }}>{error}</div>}

      {!token ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
          <Button label="구글로 로그인" icon="pi pi-google" onClick={() => login()} size="large" />
        </div>
      ) : (
        <>
          {loading && records.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
              <ProgressSpinner />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Form Section */}
              <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', background: '#fafafa' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>새로운 내역 추가 ({activeYearSheet})</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: '1 1 100px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>구분</label>
                    <Dropdown value={type} options={typeOptions} onChange={(e) => setType(e.value)} style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>날짜</label>
                    <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="yy-mm-dd" style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>{type === '이체' ? '출금(계좌)' : '자산(계좌)'}</label>
                    <Dropdown value={assetAccount} options={assets} onChange={(e) => setAssetAccount(e.value)} placeholder="선택" style={{ width: '100%' }} editable />
                  </div>
                  
                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>{type === '이체' ? '입금(계좌)' : '분류'}</label>
                    {type === '이체' ? (
                      <Dropdown value={transferTargetAccount} options={assets} onChange={(e) => setTransferTargetAccount(e.value)} placeholder="선택" style={{ width: '100%' }} editable />
                    ) : (
                      <Dropdown value={category} options={filteredCodes.map(c => c.name)} onChange={(e) => setCategory(e.value)} placeholder="선택" style={{ width: '100%' }} editable />
                    )}
                  </div>

                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>금액</label>
                    <InputNumber value={amount} onValueChange={(e) => setAmount(e.value)} style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: '2 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>내용</label>
                    <InputText value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: '0 0 auto' }}>
                    <Button label="추가하기" icon="pi pi-plus" onClick={handleAddSubmit} disabled={loading} />
                  </div>
                </div>
              </div>

              {/* Data Table Section */}
              <div>
                <DataTable value={records} paginator rows={15} loading={loading} responsiveLayout="scroll" emptyMessage="데이터가 없습니다.">
                  {headers.map((h, i) => (
                    <Column key={i} field={h} header={h} sortable></Column>
                  ))}
                </DataTable>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
