import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button, Panel, Sidebar } from '@/components/PrimeReact';
import { Calendar, InputNumber, InputText, SelectButton } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import dayjs from 'dayjs';

import { RP_TYPE } from '@/assets/js/constants';

export default function DialogRepeat({ repeat, visible, onHide }) {

  const [rpType, set_rpType] = useState(repeat?.rpType || '');
  const [rpDateS, set_rpDateS] = useState(repeat?.rpDateS ? dayjs(repeat.rpDateS).toDate() : new Date());
  const [rpDateE, set_rpDateE] = useState(repeat?.rpDateE ? dayjs(repeat.rpDateE).toDate() : new Date());
  const [rpAmount, set_rpAmount] = useState(repeat?.rpAmount || 0);
  const [rpMemo, set_rpMemo] = useState(repeat?.rpMemo || '');

  useEffect(() => {
    if (visible) {
      set_rpType(repeat?.rpType || '');
      set_rpDateS(repeat?.rpDateS ? dayjs(repeat.rpDateS).toDate() : new Date());
      set_rpDateE(repeat?.rpDateE ? dayjs(repeat.rpDateE).toDate() : new Date());
      set_rpAmount(repeat?.rpAmount || 0);
      set_rpMemo(repeat?.rpMemo || '');
    }
  }, [repeat, visible]);

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
            <SelectButton id="rpType"
              options={Object.values(RP_TYPE)}
              value={rpType} onChange={(e) => set_rpType(e.target.value)}
            />
          </div>

          <div class="inputWrap">
            <label htmlFor="rpDateS">기간</label>
            <Calendar id="rpDateS"
              locale="ko" dateFormat="yy-mm-dd (D)"
              value={rpDateS}
              onChange={(e) => set_rpDateS(e.target.value)}
            />
            <span class="mx-1">~</span>
            <Calendar id="rpDateE"
              locale="ko" dateFormat="yy-mm-dd (D)"
              value={rpDateE}
              onChange={(e) => set_rpDateE(e.target.value)}
            />
          </div>

          <div class="inputWrap">
            <label htmlFor="rpMemo">내용</label>
            <InputText id="rpMemo"
              value={rpMemo}
              onChange={(e) => set_rpMemo(e.target.value)}
            />
          </div>

          <div class="inputWrap">
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
