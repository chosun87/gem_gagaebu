import { useState, useRef } from 'react';
import { useData } from '@/context/DataContext';
import { Badge, Button, InputSwitch, DataView, Message, Tag, Menu } from '@/components/PrimeReact';
import dayjs from 'dayjs';

import DialogRepeat from '@/components/DialogRepeat';
import DialogList from '@/components/DialogList';

export default function Repeat() {
  const { sheet반복Data, sheetYYYYData, loading, handleChange_rpComplete } = useData();
  const [repeat, setRepeat] = useState(null);
  const [showDialogRepeat, setShowDialogRepeat] = useState(false);

  const menuLeft = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDialogList, setShowDialogList] = useState(false);
  const [dialogListParams, setDialogListParams] = useState({});

  const data = sheet반복Data || [];

  const menuItems = [
    {
      label: '편집',
      icon: 'pi pi-pencil',
      command: () => fnOpenDialogRepeat(selectedItem)
    },
    {
      label: '목록',
      icon: 'pi pi-list',
      command: () => fnOpenDialogList(selectedItem)
    }
  ];

  const fnOpenDialogRepeat = (repeat) => {
    setRepeat(repeat);
    setShowDialogRepeat(true);
  }

  const fnHideDialogRepeat = () => {
    setShowDialogRepeat(false);
  }

  const fnOpenDialogList = () => {
    setDialogListParams({
      rpID: selectedItem.rpID,
      header: `${selectedItem.rpCategory}-${selectedItem.rpMemo}`,
      startYear: dayjs(selectedItem.rpDateS).year(),
      endYear: dayjs(selectedItem.rpDateE).year()
    });
    setShowDialogList(true);
  }

  const fnHideDialogList = () => {
    setShowDialogList(false);
  }

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateDateViewItem = (item) => {
    const rpTypeClass = `rpType-${item.rpType}`;
    const rpCompleteClass = `rpComplete-${(item.rpComplete) ? 'Y' : 'N'}`;

    return (
      <div
        className={`list-item ${rpTypeClass} ${rpCompleteClass} col-12`}
        onClick={(e) => {
          setSelectedItem(item);
          menuLeft.current.toggle(e);
        }}
      >
        <Badge
          className={`gType-${item.rpType} text-base`}
          value={item.rpCategory}
        />

        <div className="flex-grow-1 flex flex-column gap-1">
          <div className="flex align-items-center gap-1">
            <div className="rpDate monospace">{item.rpDateS} ~ {item.rpDateE}</div>
          </div>
          <div className="flex align-items-center gap-2 flex-wrap">
            <span className="rpDay text-lg font-semibold text-nowrap">
              {item.rpPeriod === 'W' ? `매주 (${item.rpDay})` : `매월 ${item.rpDay}일`}
            </span>
            <span className="rpMemo">{item.rpMemo}</span>
          </div>
          <div className="flex align-items-center gap-2">
            <span className="rpAcc">{item.rpAcc2 ? `${item.rpAcc1} → ${item.rpAcc2}` : item.rpAcc1}</span>
          </div>
        </div>

        <div className="h-full flex flex-column align-items-end justify-content-between">
          <div className="rpAmount monospace text-right font-bold text-lg">
            {item.rpAmount.toLocaleString()}<span className="unit text-xs ">원</span>
          </div>
          {item.rpTotalAmount > 0 && (
            <div className="rpTotalAmount monospace text-right text-xs opacity-70 mt-1">
              총 {item.rpTotalAmount.toLocaleString()}원
            </div>
          )}
          <InputSwitch checked={item.rpComplete} trueValue={false} falseValue={true}
            tooltip="완료" tooltipOptions={{ position: 'top' }}
            onChange={(e) => handleChange_rpComplete(item, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };

  return (
    <>
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
            className="list-dataview"
            value={data}
            itemTemplate={templateDateViewItem}
          />
        )}
      </div>

      <Menu model={menuItems} ref={menuLeft}
        popup popupAlignment="right"
      />

      {/* Floating Action Button */}
      <Button
        className="btn-floating-action btn-add-repeat shadow-7"
        severity="secondary" size="large" rounded
        icon="pi pi-plus"
        onClick={() => fnOpenDialogRepeat(null)}
        tooltip="반복 추가" tooltipOptions={{ position: 'top' }}
      />

      {/* 반복 입력 폼 다이얼로그 */}
      <DialogRepeat
        repeat={repeat}
        visible={showDialogRepeat}
        onHide={() => fnHideDialogRepeat()}
      />

      {/* 연관 내역 조회 다이얼로그 */}
      <DialogList
        visible={showDialogList}
        onHide={() => fnHideDialogList()}
        params={dialogListParams}
      />
    </>
  );
}
