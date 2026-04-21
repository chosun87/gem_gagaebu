import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button, Panel, Sidebar, TreeSelect } from '@/components/PrimeReact';
import { Calendar, InputNumber, InputText, SelectButton } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import { classNames } from 'primereact/utils';
import dayjs from 'dayjs';

import { G_TYPE } from '@/assets/js/constants';

export default function DialogLedger({ ledger, visible, onHide }) {

  const { saveLedgerEntry, loading: dataLoading, assetNodes, categoryNodes, defaultAssetCode } = useData();

  const [gDate, set_gDate] = useState(ledger?.gDate ? dayjs(ledger.gDate).toDate() : new Date());
  const [gType, set_gType] = useState(ledger?.gType || '');
  const [gAcc1, set_gAcc1] = useState(ledger?.gAcc1 || '');
  const [gAcc2, set_gAcc2] = useState(ledger?.gAcc2 || '');
  const [gCategory, set_gCategory] = useState(ledger?.gCategory || '');
  const [gAmount, set_gAmount] = useState(ledger?.gAmount || 0);
  const [gMemo, set_gMemo] = useState(ledger?.gMemo || '');
  const [gAcc1Label, set_gAcc1Label] = useState('자산1');
  const [gAcc2Label, set_gAcc2Label] = useState('자산2');
  const [submitted, set_submitted] = useState(false);

  useEffect(() => {
    if (visible) {
      set_gDate(ledger?.gDate ? dayjs(ledger.gDate).toDate() : new Date());
      set_gType(ledger?.gType || '지출');
      set_gAcc1(ledger?.gAcc1 || defaultAssetCode || '');
      set_gAcc2(ledger?.gAcc2 || '');
      set_gCategory(ledger?.gCategory || '');
      set_gAmount(ledger?.gAmount || 0);
      set_gMemo(ledger?.gMemo || '');
      set_submitted(false);

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
    set_submitted(true);

    // 필수 항목 검증
    const isInvalid = !gDate || !gType || (gAmount === 0 || gAmount === null) || !gCategory || !gAcc1 || (gType === '이체' && !gAcc2);
    if (isInvalid) {
      return;
    }

    const formData = {
      ...ledger,
      gDate: dayjs(gDate).format('YYYY-MM-DD'),
      gType,
      gAcc1,
      gAcc2: gType === '이체' ? gAcc2 : '',
      gCategory,
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

  const onDelete = async () => {
    try {
      await deleteLedgerEntry(ledger);
      onHide();
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const footerTemplate = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary" size="large" outlined label="취소"
          onClick={onHide}
          disabled={dataLoading}
        />
        <Button
          severity="primary" size="large" label="저장"
          icon={dataLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
          onClick={onSave}
          disabled={dataLoading}
        />
        <Button className={(ledger === null) ? 'hidden' : ''}
          severity="danger" size="large"
          tooltip="삭제"
          tooltipOptions={{ position: 'top' }}
          icon={dataLoading ? "pi pi-spin pi-spinner" : "pi pi-trash"}
          onClick={onDelete}
          disabled={dataLoading}
        />
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-ledger"
      header={<h3 className="text-2xl">가계부 입력</h3>}
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
              className={classNames({ 'p-invalid': submitted && !gType })}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="gDate" className="required">날짜</label>
            <Calendar id="gDate"
              locale="ko" dateFormat="yy-mm-dd (D)"
              value={gDate}
              onChange={(e) => set_gDate(e.target.value)}
              className={classNames({ 'p-invalid': submitted && !gDate })}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="gAcc1" className="required">{gAcc1Label}</label>
            <TreeSelect id="gAcc1"
              value={gAcc1}
              options={assetNodes}
              onChange={(e) => set_gAcc1(e.value)}
              placeholder="자산 선택"
              className={classNames('w-full', { 'p-invalid': submitted && !gAcc1 })}
            />
          </div>

          <div className={`inputWrap ${gType !== '이체' ? 'hidden' : ''}`}>
            <label htmlFor="gAcc2" className="required">{gAcc2Label}</label>
            <TreeSelect id="gAcc2"
              value={gAcc2}
              options={assetNodes}
              onChange={(e) => set_gAcc2(e.value)}
              placeholder="자산 선택"
              className={classNames('w-full', { 'p-invalid': submitted && gType === '이체' && !gAcc2 })}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="gCategory" className="required">분류</label>
            <TreeSelect id="gCategory"
              value={gCategory}
              options={categoryNodes.filter(node => node.key === gType)}
              onChange={(e) => set_gCategory(e.value)}
              placeholder="분류 선택"
              className={classNames('w-full', { 'p-invalid': submitted && !gCategory })}
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
            <label htmlFor="gAmount" className="required">금액</label>
            <InputNumber id="gAmount"
              mode="currency" currency="KRW" locale="ko-KR"
              value={gAmount}
              onValueChange={(e) => set_gAmount(e.target.value)}
              className={classNames({ 'p-invalid': submitted && (gAmount === 0 || gAmount === null) })}
            />
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
