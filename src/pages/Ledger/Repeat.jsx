import { useData } from '@/context/DataContext';
import { Checkbox, DataView, Message } from '@/components/PrimeReact';

export default function Repeat() {
  const { sheet반복Data, loading, handleChange_rpComplete } = useData();
  const data = sheet반복Data || [];

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const itemTemplate = (item) => {
    const categoryOrAcc2 = item.rpCategory || item.rpAcc2;

    return (
      <div className={`list-item gType-${item.rpType} col-12`}>
        <Checkbox
          className="gExecute mr-3"
          checked={item.rpComplete}
          onChange={(e) => {
            if (handleChange_rpComplete) {
              handleChange_rpComplete(item, e.checked);
            }
          }}
        />
        <div className="flex-grow-1 flex flex-column gap-1">
          <div className="flex align-items-center gap-2">
            <span className="font-bold text-sm">[{item.rpType}]</span>
            <span className="text-500 text-sm">{item.rpDateS} ~ {item.rpDateE} (매월 {item.rpDay}일)</span>
          </div>
          <div className="text-base font-semibold">{item.rpMemo || '내용 없음'}</div>
          <div className="text-sm text-600">
            {item.rpAcc1} {categoryOrAcc2 ? `> ${categoryOrAcc2}` : ''}
          </div>
        </div>
        <div className="gAmount monospace text-right font-bold text-lg ml-3">
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
