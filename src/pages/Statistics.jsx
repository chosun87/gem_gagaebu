import { useState } from 'react';
import { Card, Message, Tag } from '@/assets/js/PrimeReact';
import { Calendar as PrimeCalendar, Checkbox, Dropdown, InputNumber, InputSwitch, InputText, SelectButton } from '@/assets/js/PrimeReact';

export default function Statistics() {
  const [inputText, setInputText] = useState('');
  const [dropdown, setDropdown] = useState('');

  const [gDate, set_gDate] = useState(new Date());
  const [gType, set_gType] = useState('');
  const [gAcc1, set_gAcc1] = useState('');
  const [gAcc2, set_gAcc2] = useState('');
  const [gCategory, set_gCategory] = useState('');
  const [gAmount, set_gAmount] = useState('');
  const [gExecuted, set_gExecuted] = useState(false);

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="app-page statistics-page">
      <h2 className="app-page-title text-3xl">통계</h2>
      <p>통계 화면입니다.</p>

      <Card title="Form">
        <div className="formWrap">
          <div className="formRow">
            <label htmlFor="inputText">InputText</label>
            <InputText id="inputText" className="p-inputtext-sm" value={inputText} onChange={(e) => setInputText(e.target.value)} />
          </div>

          <div className="formRow">
            <label htmlFor="dropdown">Dropdown</label>
            <Dropdown id="dropdown" className="p-inputtext-sm" value={dropdown} onChange={(e) => setDropdown(e.target.value)} />
          </div>

          <div className="formRow">
            <label htmlFor="gType">gType</label>
            <SelectButton id="gType"
              options={[{ label: '수입', value: '수입' }, { label: '지출', value: '지출' }, { label: '이체', value: '이체' }]}
              value={gType} onChange={(e) => set_gType(e.target.value)} />
          </div>

          <div className="formRow">
            <label htmlFor="gDate">gDate</label>
            <PrimeCalendar id="gDate"
              locale="ko" dateFormat="yy-mm-dd (D)"
              value={gDate} onChange={(e) => set_gDate(e.target.value)} />
          </div>

          <div className="formRow">
            <label htmlFor="gAcc1">gAcc1</label>
            <SelectButton id="gAcc1"
              options={[{ label: '수입', value: '수입' }, { label: '지출', value: '지출' }, { label: '이체', value: '이체' }]}
              value={gAcc1} onChange={(e) => set_gAcc1(e.target.value)} />
          </div>

          <div className="formRow">
            <label htmlFor="gAmount">gAmount</label>
            <InputNumber id="gAmount" mode="currency"
              currency="KRW"
              locale="ko-KR"
              value={gAmount} onValueChange={(e) => set_gAmount(e.target.value)} />
          </div>

          <div className="formRow">
            <InputSwitch id="gExecuted" checked={gExecuted} onChange={(e) => set_gExecuted(e.target.value)} />
            <label htmlFor="gExecuted">gExecuted</label>
          </div>
        </div>
      </Card>
    </div>
  );
}
