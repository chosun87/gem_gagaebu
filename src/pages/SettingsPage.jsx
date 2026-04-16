import { Sidebar } from 'primereact/sidebar'

export default function SettingsPage({ sidebarVisible, onClose }) {
  return (
    <div className="page-container">
      <h2>설정</h2>
      <p>이 페이지는 차후에 구성됩니다.</p>

      <Sidebar
        visible={sidebarVisible}
        onHide={onClose}
        position="right"
        header="설정 메뉴"
        modal
      >
        <p>설정 옵션이 여기에 표시됩니다.</p>
      </Sidebar>
    </div>
  )
}
