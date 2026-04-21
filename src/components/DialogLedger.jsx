import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button, Panel, Sidebar, TreeSelect } from '@/components/PrimeReact';
import { Calendar, InputNumber, InputText, SelectButton } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import { G_TYPE } from '@/assets/js/constants';

export default function DialogLedger({ ledger, visible, onHide }) {

  const { saveLedgerEntry, loading: dataLoading, assetNodes, defaultAssetCode } = useData();

  const [gDate, set_gDate] = useState(ledger?.gDate ? dayjs(ledger.gDate).toDate() : new Date());
  const [gType, set_gType] = useState(ledger?.gType || '');
  const [gAcc1, set_gAcc1] = useState(ledger?.gAcc1 || '');
  const [gAcc2, set_gAcc2] = useState(ledger?.gAcc2 || '');
  const [gAmount, set_gAmount] = useState(ledger?.gAmount || 0);
  const [gMemo, set_gMemo] = useState(ledger?.gMemo || '');
  const [gAcc1Label, set_gAcc1Label] = useState('자산1');
  const [gAcc2Label, set_gAcc2Label] = useState('자산2');

  useEffect(() => {
    if (visible) {
      set_gDate(ledger?.gDate ? dayjs(ledger.gDate).toDate() : new Date());
      set_gType(ledger?.gType || '지출');
      set_gAcc1(ledger?.gAcc1 || defaultAssetCode || '');
      set_gAcc2(ledger?.gAcc2 || '');
      set_gAmount(ledger?.gAmount || 0);
      set_gMemo(ledger?.gMemo || '');

      const [acc1Label, acc2Label] = _getAccLabels(ledger?.gType || '지출');
      set_gAcc1Label(acc1Label);
      set_gAcc2Label(acc2Label);
    }
  }, [ledger, visible, defaultAssetCode]);

  useEffect(() => {
    const [acc1Label, acc2Label] = _getAccLabels(gType);
    set_gAcc1Label(acc1Label);
    set_gAcc2Label(acc2Label);
  }, [gType]);

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
      ...ledger,
      gDate: dayjs(gDate).format('YYYY-MM-DD'),
      gType,
      gAcc1,
      gAcc2: gType === '이체' ? gAcc2 : '',
      gAmount,
      gMemo,
    };

    try {
      await saveLedgerEntry(ledger, formData);
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
      className="dialog-ledger"
      header="가계부 입력"
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel
        footerTemplate={footerTemplate}
      >
        <div className="formWrap">
          <div className="inputWrap">
            <SelectButton id="gType"
              options={Object.values(G_TYPE)}
              value={gType} onChange={(e) => set_gType(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="gDate">날짜</label>
            <Calendar id="gDate"
              locale="ko" dateFormat="yy-mm-dd (D)"
              value={gDate}
              onChange={(e) => set_gDate(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="gAcc1">{gAcc1Label}</label>
            <TreeSelect id="gAcc1"
              value={gAcc1}
              options={assetNodes}
              onChange={(e) => set_gAcc1(e.value)}
              placeholder="자산 선택"
              className="w-full"
            />
          </div>

          <div className={`inputWrap ${gType !== '이체' ? 'hidden' : ''}`}>
            <label htmlFor="gAcc2">{gAcc2Label}</label>
            <TreeSelect id="gAcc2"
              value={gAcc2}
              options={assetNodes}
              onChange={(e) => set_gAcc2(e.value)}
              placeholder="자산 선택"
              className="w-full"
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="gMemo">내용</label>
            <InputText id="gMemo"
              value={gMemo}
              onChange={(e) => set_gMemo(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="gAmount">금액</label>
            <InputNumber id="gAmount"
              mode="currency" currency="KRW" locale="ko-KR"
              value={gAmount}
              onValueChange={(e) => set_gAmount(e.target.value)}
            />
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
