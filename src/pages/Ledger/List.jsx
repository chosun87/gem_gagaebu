import { useState, useEffect } from 'react';
import { fetchSheetData, updateSheetCell } from '@/api/sheetApi';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Checkbox, DataView, Message } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import { SHEET_NAME_RANGE, SHEET_COL_INDEX } from '@/assets/js/constants';

// 한글 로케일 전역 설정 (언어만 바꿔도 달력이 한글로 렌더링 됨)
import { PrimeReact_locale } from '@/components/PrimeReact';
addLocale('ko', PrimeReact_locale.ko.Calendar);
locale('ko');

export default function List() {
  const { isSignedIn } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (isSignedIn) {
      loadSheetData(selectedDate);
    }
  }, [isSignedIn, selectedDate]);

  const loadSheetData = async (dateObj) => {
    setLoading(true);
    try {
      const thisMonth = dayjs(dateObj).format("YYYY-MM");
      const YYYY = dateObj.getFullYear().toString();
      const rawData = await fetchSheetData(SHEET_NAME_RANGE.YEAR.replace("YYYY", YYYY));

      const currentMonthNum = dateObj.getMonth() + 1; // 1 ~ 12
      const parsedData = [];

      // rawData.filter((row) => row[SHEET_COL_INDEX.gDate].includes(thisMonth)).forEach((row, index) => {

      // })
      // 0번째 인덱스부터 모두 검사 (헤더가 없을 수도 있으므로)
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        let isSameMonth = false;

        // 날짜 형식 유연하게 처리 (-, /, . 혹은 공백 구분자)
        const dateParts = row[SHEET_COL_INDEX.gDate].split(/[-./\s]+/);
        if (dateParts.length >= 2) {
          const rowMonthNum = parseInt(dateParts[1], 10);
          if (rowMonthNum === currentMonthNum) {
            isSameMonth = true;
          }
        }

        if (isSameMonth) {
          // 쉼표 제거나 원(₩), 달러($) 등의 문자 제거
          const rawAmount = String(row[SHEET_COL_INDEX.gAmount] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '');

          parsedData.push({
            sheetName: YYYY,
            sheetRowNo: i + 1, // 행 번호는 인덱스 + 1
            gDate: row[SHEET_COL_INDEX.gDate] || '',
            gType: row[SHEET_COL_INDEX.gType] || '',
            gAcc1: row[SHEET_COL_INDEX.gAcc1] || '',
            gAcc2: row[SHEET_COL_INDEX.gAcc2] || '',
            gCategory: row[SHEET_COL_INDEX.gCategory] || '',
            gAmount: Number(rawAmount) || 0,
            gMemo: row[SHEET_COL_INDEX.gMemo] || '',
            gExecuted: (String(row[SHEET_COL_INDEX.gExecuted]).toUpperCase() === 'TRUE') ? true : false,
            g_rpID: row[SHEET_COL_INDEX.g_rpID] || '',
          });
        }
      }

      // 최신의 데이터가 위로 오도록 역순 정렬
      setData(parsedData.reverse());
    } catch (error) {
      console.error('Data loading error', error);
      setData([]); // 시트가 없거나 에러 발생 시 빈 배열로 초기화
    } finally {
      setLoading(false);
    }
  };

  // 월 변경
  const handleMonthChange = (e) => {
    const newDate = new Date(e.year, e.month - 1, 1)
    console.log("새로운 월:", e, newDate);
    setSelectedDate(newDate);
  }

  // gExecute 체크박스 변경
  const handleChange_gExecute = async (rowData, newValue) => {
    // 1. 화면 즉각 업데이트(Optimistic Update)
    setData(prevData => prevData.map(item =>
      item.sheetRowNo === rowData.sheetRowNo
        ? { ...item, gExecuted: newValue }
        : item
    ));

    // 2. 구글 시트 실제 값 쓰기 업데이트
    try {
      const sheetColName = String.fromCharCode('A'.charCodeAt(0) + SHEET_COL_INDEX.gExecuted);
      await updateSheetCell(`${rowData.sheetName}!${sheetColName}${rowData.sheetRowNo}`, newValue);
    } catch (error) {
      // 쓰기 실패 시 롤백 (원상복구)
      setData(prevData => prevData.map(item =>
        item.sheetRowNo === rowData.sheetRowNo
          ? { ...item, gExecuted: !newValue }
          : item
      ));
    }
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const itemTemplate = (item) => {
    return (
      <div className={`list-item gType-${item.gType} col-12`}>
        <Checkbox
          className="gExecute mr-3"
          checked={item.gExecuted}
          onChange={(e) => handleChange_gExecute(item, e.checked)}
        />
        <div className="flex-grow-1 flex flex-column gap-1">
          <div className="flex align-items-center gap-2">
            <span className="font-bold text-sm">[{item.gType}]</span>
            <span className="text-500 text-sm">{item.gDate}</span>
          </div>
          <div className="text-base font-semibold">{item.gMemo || '내용 없음'}</div>
          <div className="text-sm text-600">
            {item.gAcc1} {item.gCategoryOrAcc2 ? `> ${item.gCategoryOrAcc2}` : ''}
          </div>
        </div>
        <div className="gAmount monospace text-right font-bold text-lg ml-3">
          {item.gAmount.toLocaleString()}원
        </div>
      </div>
    );
  };

  return (
    <div className="list-page">
      <Calendar className="month-calendar" value={selectedDate} onMonthChange={handleMonthChange} inline
        locale="ko"
      />

      {!isSignedIn ? (
        <div className="flex align-items-center justify-content-center h-full p-5">
          <Message severity="warn" text="구글 로그인이 필요합니다." />
        </div>
      ) : loading ? (
        <div className="flex align-items-center justify-content-center h-full p-5">
          <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex align-items-center justify-content-center h-full text-500 p-5">
          <Message severity="warn" text="이번 달 내역이 없습니다." />
        </div>
      ) : (
        <DataView
          value={data}
          loading={loading}
          loadingIcon="pi pi-spin pi-spinner"
          itemTemplate={itemTemplate}
          className="list-dataview flex-grow-1 w-full"
        />
      )}
    </div>
  );
}
