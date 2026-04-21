import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button, Panel, Sidebar, TreeSelect } from '@/components/PrimeReact';
import { Calendar, InputNumber, InputText, SelectButton } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import { RP_TYPE } from '@/assets/js/constants';

export default function DialogRepeat({ repeat, visible, onHide }) {

  const { saveRepeatEntry, loading: dataLoading, assetNodes, defaultAssetCode, periodOptions } = useData();

  const [rpType, set_rpType] = useState(repeat?.rpType || '');
  const [rpDateS, set_rpDateS] = useState(repeat?.rpDateS ? dayjs(repeat.rpDateS).toDate() : new Date());
  const [rpDateE, set_rpDateE] = useState(repeat?.rpDateE ? dayjs(repeat.rpDateE).toDate() : new Date());
  const [rpPeriod, set_rpPeriod] = useState(repeat?.rpPeriod || 'M');
  const [rpDay, set_rpDay] = useState(repeat?.rpDay || 1);
  const [rpAcc1, set_rpAcc1] = useState(repeat?.rpAcc1 || '');
  const [rpAcc2, set_rpAcc2] = useState(repeat?.rpAcc2 || '');
  const [rpCategory, set_rpCategory] = useState(repeat?.rpCategory || '');
  const [rpAmount, set_rpAmount] = useState(repeat?.rpAmount || 0);
  const [rpMemo, set_rpMemo] = useState(repeat?.rpMemo || '');
  const [rpComplete, set_rpComplete] = useState(repeat?.rpComplete || false);

  const [rpAcc1Label, set_rpAcc1Label] = useState('자산1');
  const [rpAcc2Label, set_rpAcc2Label] = useState('자산2');

  useEffect(() => {
    if (visible) {
      set_rpType(repeat?.rpType || '지출');
      set_rpDateS(repeat?.rpDateS ? dayjs(repeat.rpDateS).toDate() : new Date());
      set_rpDateE(repeat?.rpDateE ? dayjs(repeat.rpDateE).toDate() : dayjs().add(1, 'year').toDate());
      set_rpPeriod(repeat?.rpPeriod || 'M');
      set_rpDay(repeat?.rpDay || 1);
      set_rpAcc1(repeat?.rpAcc1 || defaultAssetCode || '');
      set_rpAcc2(repeat?.rpAcc2 || '');
      set_rpCategory(repeat?.rpCategory || '');
      set_rpAmount(repeat?.rpAmount || 0);
      set_rpMemo(repeat?.rpMemo || '');
      set_rpComplete(repeat?.rpComplete || false);

      const [acc1Label, acc2Label] = _getAccLabels(repeat?.rpType || '지출');
      set_rpAcc1Label(acc1Label);
      set_rpAcc2Label(acc2Label);
    }
  }, [repeat, visible, defaultAssetCode]);

  useEffect(() => {
    const [acc1Label, acc2Label] = _getAccLabels(rpType);
    set_rpAcc1Label(acc1Label);
    set_rpAcc2Label(acc2Label);
  }, [rpType]);

  const _getAccLabels = (type) => {
    switch (type) {
      case '수입': return ['입금계좌', '']
      case '지출': return ['출금계좌', '']
      case '이체': return ['출금계좌', '입금계좌']
      default: return ['자산1', '자산2']
    }
  }

  const onSave = async () => {
    const formData = {
      ...repeat,
      rpType,
      rpDateS,
      rpDateE,
      rpPeriod,
      rpDay,
      rpAcc1,
      rpAcc2: rpType === '이체' ? rpAcc2 : '',
      rpCategory,
      rpAmount,
      rpMemo,
      rpComplete
    };

    try {
      await saveRepeatEntry(repeat, formData);
      onHide();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const footerTemplate = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary" outlined label="취소"
          onClick={onHide}
          disabled={dataLoading}
        />
        <Button
          severity="primary" label="저장"
          icon={dataLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
          onClick={onSave}
          disabled={dataLoading}
        />
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-repeat"
      header="반복 내역 설정"
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel
        footerTemplate={footerTemplate}
      >
        <div className="formWrap">
          <div className="inputWrap">
            <SelectButton id="rpType"
              options={Object.values(RP_TYPE)}
              value={rpType} onChange={(e) => set_rpType(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpDateS">반복 기간</label>
            <div className="flex align-items-center gap-2">
              <Calendar id="rpDateS"
                locale="ko" dateFormat="yy-mm-dd"
                value={rpDateS}
                onChange={(e) => set_rpDateS(e.target.value)}
                className="flex-grow-1"
              />
              <span>~</span>
              <Calendar id="rpDateE"
                locale="ko" dateFormat="yy-mm-dd"
                value={rpDateE}
                onChange={(e) => set_rpDateE(e.target.value)}
                className="flex-grow-1"
              />
            </div>
          </div>

          <div className="inputWrap">
            <label htmlFor="rpPeriod">반복 주기</label>
            <SelectButton id="rpPeriod"
              options={periodOptions}
              value={rpPeriod}
              onChange={(e) => set_rpPeriod(e.value)}
              className="w-full"
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpDay">반복일</label>
            <div className="flex align-items-center gap-2">
              <InputNumber id="rpDay"
                value={rpDay} onValueChange={(e) => set_rpDay(e.value)}
                min={1} max={31}
                prefix="매월 " suffix=" 일"
                className="w-full"
              />
            </div>
          </div>

          <div className="inputWrap">
            <label htmlFor="rpAcc1">{rpAcc1Label}</label>
            <TreeSelect id="rpAcc1"
              value={rpAcc1}
              options={assetNodes}
              onChange={(e) => set_rpAcc1(e.value)}
              placeholder="자산 선택"
              className="w-full"
            />
          </div>

          <div className={`inputWrap ${rpType !== '이체' ? 'hidden' : ''}`}>
            <label htmlFor="rpAcc2">{rpAcc2Label}</label>
            <TreeSelect id="rpAcc2"
              value={rpAcc2}
              options={assetNodes}
              onChange={(e) => set_rpAcc2(e.value)}
              placeholder="자산 선택"
              className="w-full"
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpCategory">카테고리</label>
            <InputText id="rpCategory"
              value={rpCategory}
              onChange={(e) => set_rpCategory(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpMemo">내용(메모)</label>
            <InputText id="rpMemo"
              value={rpMemo}
              onChange={(e) => set_rpMemo(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpAmount">금액</label>
            <InputNumber id="rpAmount"
              mode="currency" currency="KRW" locale="ko-KR"
              value={rpAmount}
              onValueChange={(e) => set_rpAmount(e.target.value)}
            />
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
