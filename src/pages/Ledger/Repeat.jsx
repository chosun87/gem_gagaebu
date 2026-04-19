import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Badge, Button, InputSwitch, DataView, Dialog, Message, Tag } from '@/components/PrimeReact';

export default function Repeat() {
  const { sheet반복Data, sheetYYYYData, loading, handleChange_rpComplete } = useData();
  const [showForm, setShowForm] = useState(false);

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
        <InputSwitch checked={item.rpComplete}
          tooltip="완료"
          tooltipOptions={{ position: 'top' }}
          onChange={(e) => handleChange_rpComplete(item, e.target.value)}
        />

        <Badge size="large"
          className={`gType-${item.rpType}`}
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

        <div className="rpAmount monospace text-right font-bold text-lg">
          {item.rpAmount.toLocaleString()}<span class="unit">원</span>
        </div>
      </div>
    );
  };

  return (
    <div className="panel-inner list-page repeat-page">
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

      {/* Floating Action Button */}
      <Button
        className="btn-floating-action btn-add-repeat shadow-6"
        severity="primary" size="large" rounded
        icon="pi pi-plus"
        onClick={() => setShowForm(true)}
        tooltip="반복 추가"
        tooltipOptions={{ position: 'top' }}
      />

      {/* 가계부 입력 폼 다이얼로그 */}
      <Dialog
        header="가계부 입력폼"
        visible={showForm}
        style={{ width: '90vw', maxWidth: '600px' }}
        modal
        onHide={() => setShowForm(false)}
      >
        <p className="m-0 text-center p-5">
          가계부 입력폼
        </p>
      </Dialog>
    </div>
  );
}
