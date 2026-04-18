import { useData } from '@/context/DataContext';
import { Calendar, Checkbox, DataView, Message } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

// 한글 로케일 전역 설정 (언어만 바꿔도 달력이 한글로 렌더링 됨)
import { PrimeReact_locale } from '@/components/PrimeReact';
addLocale('ko', PrimeReact_locale.ko.Calendar);
locale('ko');

export default function List() {
  const { yearData, loading, selectedDate, setSelectedDate, handleChange_gExecute } = useData();

  // 월 변경
  const handleMonthChange = (e) => {
    const newDate = new Date(e.year, e.month - 1, 1);
    setSelectedDate(newDate);
  }

  // yearData에서 현재 선택된 달의 데이터만 필터링
  const currentMonthNum = selectedDate.getMonth() + 1;
  const monthData = yearData.filter(item => {
    const dateParts = item.gDate.split(/[-./\s]+/);
    if (dateParts.length >= 2) {
      const rowMonthNum = parseInt(dateParts[1], 10);
      return rowMonthNum === currentMonthNum;
    }
    return false;
  });

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const itemTemplate = (item) => {
    const categoryOrAcc2 = item.gCategory || item.gAcc2;

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
            {item.gAcc1} {categoryOrAcc2 ? `> ${categoryOrAcc2}` : ''}
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
      <Calendar className="month-calendar"
        inline
        locale="ko"
        value={selectedDate}
        onMonthChange={handleMonthChange}
      />

      {loading ? (
        <div className="flex align-items-center justify-content-center h-full p-5">
          <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : monthData.length === 0 ? (
        <div className="flex align-items-center justify-content-center h-full text-500 p-5">
          <Message severity="warn" text="이번 달 내역이 없습니다." />
        </div>
      ) : (
        <DataView
          className="list-dataview flex-grow-1 w-full"
          value={monthData}
          itemTemplate={itemTemplate}
        />
      )}
    </div>
  );
}
