import { Sidebar, Panel } from '@/components/PrimeReact';

export default function Settings({ visible, onHide }) {

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Sidebar
      className="dialog-settings shadow-7 w-25rem"
      header={<h3 className="dialog-title text-2xl">설정</h3>}
      position="right"
      visible={visible}
      onHide={onHide}
    >
      <Panel>
        <div className="settings-page">
          <p>설정 화면입니다.</p>
        </div>
      </Panel>
    </Sidebar>
  );
}
