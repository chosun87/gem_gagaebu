import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button, Panel, Sidebar } from '@/components/PrimeReact';
import { Calendar, InputNumber, InputText, SelectButton } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import { G_TYPE } from '@/assets/js/constants';

export default function DialogLedger({ ledger, visible, onHide }) {

  const { saveLedgerEntry, loading: dataLoading } = useData();

  const [gType, set_gType] = useState(ledger?.gType || '');
  const [gDate, set_gDate] = useState(ledger?.gDate ? dayjs(ledger.gDate).toDate() : new Date());
  const [gAmount, set_gAmount] = useState(ledger?.gAmount || 0);
  const [gMemo, set_gMemo] = useState(ledger?.gMemo || '');

  useEffect(() => {
    if (visible) {
      set_gType(ledger?.gType || '');
      set_gDate(ledger?.gDate ? dayjs(ledger.gDate).toDate() : new Date());
      set_gAmount(ledger?.gAmount || 0);
      set_gMemo(ledger?.gMemo || '');
    }
  }, [ledger, visible]);

  const onSave = async () => {
    const formData = {
      ...ledger,
      gType,
      gDate: dayjs(gDate).format('YYYY-MM-DD'),
      gAmount,
      gMemo
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
        <div class="formWrap">
          <div class="inputWrap">
            <SelectButton id="gType"
              options={Object.values(G_TYPE)}
              value={gType} onChange={(e) => set_gType(e.target.value)}
            />
          </div>

          <div class="inputWrap">
            <label htmlFor="gDate">날짜</label>
            <Calendar id="gDate"
              locale="ko" dateFormat="yy-mm-dd (D)"
              value={gDate}
              onChange={(e) => set_gDate(e.target.value)}
            />
          </div>

          <div class="inputWrap">
            <label htmlFor="gMemo">내용</label>
            <InputText id="gMemo"
              value={gMemo}
              onChange={(e) => set_gMemo(e.target.value)}
            />
          </div>

          <div class="inputWrap">
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
