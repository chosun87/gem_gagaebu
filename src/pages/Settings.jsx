import { Sidebar } from '@/components/PrimeReact';

export default function Settings({ visible, onHide }) {
  return (
    <Sidebar header="설정"
      className="app-sidebar"
      position="right"
      visible={visible}
      onHide={onHide}
    >
      <div className="settings-page">
        <h2>설정</h2>
        <p>설정 화면입니다.</p>
      </div>
    </Sidebar>
  );
}
