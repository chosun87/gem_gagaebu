import { Sidebar, Panel, Menu } from '@/assets/js/PrimeReact';
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
    {
      label: '디자인 템플릿',
      items: [
        {
          label: '빈 페이지 템플릿',
          icon: 'pi pi-file',
          command: () => {
            navigate('/samples/blank');
          },
        },
        {
          label: '우측 사이드바 템플릿',
          icon: 'pi pi-arrow-left',
          command: () => {
            navigate('/samples/blankSidebarRight');
          },
        },
        {
          label: '하단 사이드바 템플릿',
          icon: 'pi pi-arrow-up',
          command: () => {
            navigate('/samples/blankSidebarBottom');
          },
        },
        {
          label: '월별 빈 페이지 템플릿',
          icon: 'pi pi-calendar',
          command: () => {
            navigate('/samples/blankMonthly');
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
      <Panel className="settings-content">
        <Menu model={menuItems} className="w-full border-none p-0" />
      </Panel>
    </Sidebar>
  );
}
