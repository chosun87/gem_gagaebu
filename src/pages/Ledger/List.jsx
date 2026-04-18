import { useState, useEffect } from 'react';
import { locale, addLocale } from 'primereact/api';
import { DataView, Checkbox, Calendar, Button } from '@/components/PrimeReact';
import { fetchSheetData, updateSheetCell } from '@/api/sheetApi';
import { useAuth } from '@/context/AuthContext';
import dayjs from 'dayjs';

// 한글 로케일 전역 설정 (언어만 바꿔도 달력이 한글로 렌더링 됨)
addLocale('ko', {
  firstDayOfWeek: 0,
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  today: '오늘',
  clear: '초기화'
});
locale('ko');

export default function List() {
  const { isSignedIn } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (isSignedIn) {
      loadData(selectedDate);
    }
  }, [isSignedIn, selectedDate]);

  const loadData = async (dateObj) => {
    setLoading(true);
    try {
      const year = dateObj.getFullYear().toString();
      const rawData = await fetchSheetData(`${year}!A:Z`);

      const currentMonthNum = dateObj.getMonth() + 1; // 1 ~ 12
      const parsedData = [];

      // 0번째 인덱스부터 모두 검사 (헤더가 없을 수도 있으므로)
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 3) continue;

        let isSameMonth = false;

        // 날짜 형식 유연하게 처리 (-, /, . 혹은 공백 구분자)
        const dateParts = gDate.split(/[-./\s]+/);
        if (dateParts.length >= 2) {
          const rowMonthNum = parseInt(dateParts[1], 10);
          if (rowMonthNum === currentMonthNum) {
            isSameMonth = true;
          }
        }

        if (isSameMonth) {
          // 쉼표 제거나 원(₩), 달러($) 등의 문자 제거
          const rawAmount = String(row[5] || '0').replace(/,/g, '').replace(/[^0-9.-]+/g, '');

          parsedData.push({
            sheetRowNumber: i + 1, // 행 번호는 인덱스 + 1
            gDate: row[0] || '',
            gType: row[1] || '',
            gAcc1: row[2] || '',
            gAcc2: row[3] || '',
            gCategory: row[4] || '',
            gAmount: Number(rawAmount) || 0,
            gMemo: row[6] || '',
            gExecuted: (String(row[7]).toUpperCase() === 'TRUE') ? true : false,
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

  const onChange_gExecute = async (rowData, newValue) => {
    // 1. 화면 즉각 업데이트(Optimistic Update)
    setData(prevData => prevData.map(item =>
      item.sheetRowNumber === rowData.sheetRowNumber
        ? { ...item, gExecuted: newValue }
        : item
    ));

    // 2. 구글 시트 실제 값 쓰기 업데이트
    try {
      const year = selectedDate.getFullYear().toString();
      // 유저 매핑 기준 8번째 열(인덱스 7)이 gExecuted (H열)
      await updateSheetCell(`${year}!H${rowData.sheetRowNumber}`, newValue);
    } catch (error) {
      // 쓰기 실패 시 롤백 (원상복구)
      setData(prevData => prevData.map(item =>
        item.sheetRowNumber === rowData.sheetRowNumber
          ? { ...item, gExecuted: !newValue }
          : item
      ));
    }
  };

  const changeMonth = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const handleMonthChange = (e) => {
    console.log("새로운 월:", e, dayjs(new Date(e.year, e.month - 1, 1)).format("YYYY-MM"));
  }

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const itemTemplate = (item) => {
    return (
      <div className={`list-item gType-${item.gType} col-12`}>
        <Checkbox
          className="gExecute mr-3"
          checked={item.gExecuted}
          onChange={(e) => onChange_gExecute(item, e.checked)}
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
      <div>{`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`}</div>

      {/* Month Navigator 렌더링 구역 */}
      <div className="flex justify-content-between align-items-center p-3 surface-0 border-bottom-1 surface-border">
        <Button icon="pi pi-angle-left" rounded text onClick={() => changeMonth(-1)} className="p-button-secondary" />
        <Calendar
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value)}
          view="month"
          dateFormat="yy년 mm월"
          readOnlyInput
          inputClassName="border-none shadow-none text-center font-bold text-xl cursor-pointer p-0"
          style={{ width: '150px' }}
        />
        <Button icon="pi pi-angle-right" rounded text onClick={() => changeMonth(1)} className="p-button-secondary" />
      </div>

      {!isSignedIn ? (
        <div className="flex align-items-center justify-content-center h-full text-500 p-5">
          <p>구글 로그인이 필요합니다.</p>
        </div>
      ) : loading ? (
        <div className="flex align-items-center justify-content-center h-full text-500 p-5">
          <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex align-items-center justify-content-center h-full text-500 p-5">
          <p>이번 달 내역이 없습니다.</p>
        </div>
      ) : (
        <DataView
          value={data}
          itemTemplate={itemTemplate}
          className="list-dataview flex-grow-1 w-full"
        />
      )}
    </div>
  );
}
