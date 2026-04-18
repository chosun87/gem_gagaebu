import { useData } from '@/context/DataContext';
import { Badge, Checkbox, DataView, Message, Tag, ToggleButton } from '@/components/PrimeReact';

export default function Repeat() {
  const { sheet반복Data, sheetYYYYData, loading, handleChange_rpComplete } = useData();
  const data = sheet반복Data || [];

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const itemTemplate = (item) => {
    const categoryOrAcc2 = item.rpCategory || item.rpAcc2;
    let n회차 = 0
    console.log(sheetYYYYData)
    // sheetYYYYData.forEach(yearData => {
    // n회차 += yearData.filter((row) => row.g_rpID === item.rpID && row.gExecuted).length;
    // });

    return (
      <div className={`list-item gType-${item.rpType} col-12`}>
        <Checkbox
          className="rpComplete mr-2"
          tooltip="완료"
          tooltipOptions={{ position: 'top' }}
          checked={item.rpComplete}
          onChange={(e) => {
            if (handleChange_rpComplete) {
              handleChange_rpComplete(item, e.checked);
            }
          }}
        />

        <Badge size="large"
          className={`gType-${item.rpType} mr-1`}
          value={item.rpType}
        />

        <div className="flex-grow-1 flex flex-column gap-1">
          <div className="flex align-items-center gap-2">
            <div className="rpDate">{item.rpDateS} ~ {item.rpDateE}</div>
          </div>
          <div className="flex align-items-center gap-2">
            <span className="rpDay font-semibold">매월 {item.rpDay}일</span>
            <span className="rpAcc">{item.rpAcc2 ? `${item.rpAcc1} → ${item.rpAcc2}` : item.rpAcc1}</span>
          </div>
          <div className="flex align-items-center gap-1">
            <Tag
              className="rpCategory" rounded
              value={item.rpCategory || '내용 없음'}
            />
            <span className="rpMemo font-semibold">{item.rpMemo || '내용 없음'}</span>
          </div>
        </div>

        <div className="rpAmount monospace text-right font-bold text-lg ml-3">
          {item.rpAmount.toLocaleString()}원
        </div>
      </div>
    );
  };

  return (
    <div className="list-page repeat-page">
      {loading && data.length === 0 ? (
        <div className="flex align-items-center justify-content-center h-full p-5">
          <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex align-items-center justify-content-center h-full text-500 p-5">
          <Message severity="warn" text="반복 내역이 없습니다." />
        </div>
      ) : (
        <DataView
          className="list-dataview flex-grow-1 w-full"
          value={data}
          itemTemplate={itemTemplate}
        />
      )}
    </div>
  );
}
