import { Sidebar, Menu } from '@/assets/js/PrimeReact';
import { useNavigate } from 'react-router-dom';

export default function Settings({ visible, onHide }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: '데이터 관리',
      items: [
        {
          label: '반복 입출금 관리',
          icon: 'pi pi-clone',
          command: () => {
            navigate('/settings/repeat');
          },
        },
      ],
    },
  ];

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Sidebar
      className="dialog-settings shadow-7 w-full sm:w-25rem"
      header={<h3 className="dialog-title text-2xl">설정</h3>}
      position="right"
      visible={visible}
      onHide={onHide}
    >
      <div className="settings-content py-2">
        <Menu model={menuItems} className="w-full border-none p-0" />
      </div>
    </Sidebar>
  );
}
