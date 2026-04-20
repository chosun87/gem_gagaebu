import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Calendar } from '@/components/PrimeReact';
import { Button, Panel, Sidebar } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

export default function DialogRepeat({ repeat, visible, onHide }) {

  const [rpDateS, set_rpDateS] = useState(repeat.rpDateS);

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
      className="dialog-repeat"
      header="반복 입력"
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel
        footerTemplate={footerTemplate}
      >

        {JSON.stringify(repeat)}

        <div class="formWrap">
          <div class="inputWrap">
            <label htmlFor="rpDateS">기간</label>
            <Calendar id="rpDateS"
              locale="ko" dateFormat="yy-mm-dd (D)"
              value={rpDateS}
              onChange={(e) => set_rpDateS(e.target.value)} />
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
