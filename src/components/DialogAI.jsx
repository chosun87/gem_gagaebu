import { useState } from 'react';
import { Sidebar, Panel, Button, InputTextarea } from '@/assets/js/PrimeReact';

export default function DialogAI({ visible, onHide, onParsed }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const onParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      // TODO: 실제 AI 분석 로직 추가
      // 임시로 성공 처리
      setTimeout(() => {
        alert('분석 준비 중입니다.');
        setLoading(false);
        // onParsed(parsedData);
        // onHide();
      }, 1000);
    } catch (e) {
      alert('분석에 실패했습니다.');
      setLoading(false);
    }
  };

  const templateFooter = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary" size="large" outlined label="취소"
          onClick={onHide}
          disabled={loading}
        />
        <Button
          severity="primary" size="large" label="분석"
          icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sparkles"}
          onClick={onParse}
          disabled={loading || !text.trim()}
        />
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-ai shadow-7"
      header={<h3 className="dialog-title text-2xl icon-gemini"><i className="pi pi-sparkles mr-2 text-primary" />AI 자동 입력</h3>}
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel footerTemplate={templateFooter}>
        <p className="text-secondary text-sm m-0" style={{ lineHeight: '1.5' }}>
          은행 결제 문자(SMS), 영수증 텍스트 등을 붙여넣으세요.<br />
          AI가 내용을 분석하여 자동으로 가계부 입력 항목을 채워줍니다.
        </p>
        <div className="formWrap">
          <div className="formRow">
            <div className="inputWrap">
              <InputTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="w-full text-base"
                placeholder="여기에 결제 내역 텍스트를 붙여넣으세요..."
                autoFocus
              />
            </div>
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
