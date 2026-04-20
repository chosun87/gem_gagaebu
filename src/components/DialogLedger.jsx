import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button, Panel, Sidebar } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

export default function DialogLedger({ ledger, visible, onHide }) {

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const footerTemplate = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary" outlined label="취소"
          onClick={onHide}
        />
        <Button
          severity="primary" label="저장"
          onClick={onHide}
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
        {JSON.stringify(ledger)}
      </Panel>
    </Sidebar>
  );
}
