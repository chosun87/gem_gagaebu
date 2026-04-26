import { useState, useMemo } from 'react';
import { Sidebar, Panel, DataView, Badge, InputSwitch, Button, Message } from '@/components/PrimeReact';
import { useData } from '@/context/DataContext';
import dayjs from 'dayjs';
import DialogLedger from '@/components/DialogLedger';

export default function DialogList({ visible, onHide, params }) {
  const { yearData, handleChange_gExecute } = useData();
  const { loading: dataLoading } = useData();
  const [ledger, setLedger] = useState(null);
  const [showDialogLedger, setShowDialogLedger] = useState(false);

  // 파라미터 기반 필터링 로직
  const filteredData = useMemo(() => {
    if (!params) return [];

    return yearData.filter(item => {
      // 날짜 조건 (date)
      if (params.date && item.gDate !== params.date) return false;

      // 타입 조건 (type)
      if (params.type && item.gType !== params.type) return false;

      // 자산 조건 (accCode)
      if (params.accCode && item.gAcc1 !== params.accCode && item.gAcc2 !== params.accCode) return false;

      // 분류 조건 (category)
      if (params.category && item.gCategory !== params.category) return false;

      return true;
    });
  }, [yearData, params]);

  // 헤더에 출력할 조건 텍스트 생성
  const headerText = useMemo(() => {
    if (!params) return '조회 내역';
    const parts = [];
    if (params.date) parts.push(dayjs(params.date).format('YYYY년 MM월 DD일'));
    if (params.type) parts.push(`[${params.type}]`);
    if (params.category) parts.push(`[${params.category}]`);
    return parts.length > 0 ? parts.join(' ') + ' 내역' : '조회 내역';
  }, [params]);

  const fnOpenDialogLedger = (ledger) => {
    setLedger(ledger);
    setShowDialogLedger(true);
  }

  const fnHideDialogLedger = () => {
    setShowDialogLedger(false);
  }

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateFooter = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary" size="large" outlined label="취소"
          onClick={onHide}
          disabled={dataLoading}
        />
        <Button
          severity="secondary" size="large" label="추가"
          icon={dataLoading ? "pi pi-spin pi-spinner" : "pi pi-plus"}
          onClick={() => fnOpenDialogLedger(null)}
          disabled={dataLoading}
        />
      </div>
    );
  };

  // MonthlyList.jsx에서 복사한 아이템 템플릿 (UI 일관성 유지)
  const templateDateViewItem = (item) => {
    const gTypeClass = `gType-${item.gType}`;
    const gExecutedClass = `gExecuted-${(item.gExecuted) ? 'Y' : 'N'}`;

    return (
      <div
        className={`list-item ${gTypeClass} ${gExecutedClass} col-12`}
        onClick={() => fnOpenDialogLedger(item)}
      >
        <Badge
          className={`gType-${item.gType} text-base`}
          value={item.gCategory}
        />

        <div className="flex-grow-1 flex flex-column gap-1">
          <div className="flex align-items-center gap-2">
            <span className="gDate text-lg font-semibold">{dayjs(item.gDate).format('DD일')}</span>
            <span className="gMemo">{item.gMemo}</span>
          </div>
          <div className="flex align-items-center gap-1">
            <span className="gAcc">{item.gAcc2 ? `${item.gAcc1} → ${item.gAcc2}` : item.gAcc1}</span>
          </div>
        </div>

        <div className="gAmount monospace text-right font-bold text-lg">
          {item.gAmount.toLocaleString()}<span className="unit text-xs">원</span>
        </div>

        <InputSwitch checked={item.gExecuted} trueValue={false} falseValue={true}
          tooltip="실행" tooltipOptions={{ position: 'top' }}
          onChange={(e) => handleChange_gExecute(item, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-list shadow-7"
      header={<h3 className="dialog-title text-2xl">{headerText}</h3>}
      position="bottom"
      visible={visible}
      onHide={onHide}
      footerTemplate={templateFooter}
    >
      <Panel
        footerTemplate={templateFooter}
      >
        <div className="list-page">
          {dataLoading ? (
            <div className="flex align-items-center justify-content-center h-full p-5">
              <i className="pi pi-spin pi-spinner mr-2" style={{ fontSize: '1.5rem' }}></i>
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex align-items-center justify-content-center h-full text-500 p-5">
              <Message severity="warn" text="해당 조건의 내역이 없습니다." />
            </div>
          ) : (
            <DataView
              className="list-dataview"
              value={filteredData}
              itemTemplate={templateDateViewItem}
            />
          )}
        </div>
      </Panel>

      {/* 내역 수정용 다이얼로그 */}
      <DialogLedger
        ledger={ledger}
        visible={showDialogLedger}
        onHide={fnHideDialogLedger}
      />
    </Sidebar>
  );
}
