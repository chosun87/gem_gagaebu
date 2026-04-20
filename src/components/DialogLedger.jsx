import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Sidebar } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

export default function DialogLedger({ ledger, visible, onHide }) {

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Sidebar
      className="dialog-ledger"
      header="가계부 입력"
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <div className="settings-page">
        <h2>가계부 입력</h2>
        <p>가계부 입력 화면입니다.</p>
        {JSON.stringify(ledger)}
      </div>
    </Sidebar>
  );
}
