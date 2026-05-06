import { Panel, Sidebar } from '@/assets/js/PrimeReact';

export default function DialogSampleRight({ visible, onHide }) {
  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Sidebar
      className="dialog-sample-right shadow-7 w-full sm:w-25rem"
      header={<h3 className="dialog-title text-2xl">우측 사이드바</h3>}
      position="right"
      visible={visible}
      onHide={onHide}
    >
      <Panel>
        <div>
          우측에서 나오는 사이드바 내용입니다. DialogSettings.jsx 구조를
          참고했습니다.
        </div>
      </Panel>
    </Sidebar>
  );
}
