import { Sidebar, Panel, Menu, Dropdown } from '@/assets/js/PrimeReact'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Settings({ visible, onHide }) {
  const navigate = useNavigate()
  const [framework, setFramework] = useState(
    localStorage.getItem('ui-framework') || 'primereact',
  )

  const frameworkOptions = [
    { label: 'PrimeReact', value: 'primereact' },
    { label: 'Material UI (MUI)', value: 'mui' },
  ]

  const handleFrameworkChange = (e) => {
    const value = e.value
    setFramework(value)
    localStorage.setItem('ui-framework', value)
    window.location.reload()
  }

  const menuItems = [
    {
      label: '데이터 관리',
      className: 'text-lg',
      items: [
        {
          label: '반복 입출금 관리',
          icon: 'pi pi-clone',
          command: () => {
            navigate('/settings/repeat')
          },
        },
      ],
    },
    {
      label: '디자인 템플릿',
      className: 'text-lg mt-3',
      items: [
        {
          label: '빈 페이지 템플릿',
          icon: 'pi pi-file',
          command: () => {
            navigate('/samples/blank')
          },
        },
        {
          label: '우측 사이드바 템플릿',
          icon: 'pi pi-arrow-left',
          command: () => {
            navigate('/samples/blankSidebarRight')
          },
        },
        {
          label: '하단 사이드바 템플릿',
          icon: 'pi pi-arrow-up',
          command: () => {
            navigate('/samples/blankSidebarBottom')
          },
        },
        {
          label: '월별 빈 페이지 템플릿',
          icon: 'pi pi-calendar',
          command: () => {
            navigate('/samples/blankMonthly')
          },
        },
      ],
    },
  ]

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
        <div className="flex align-items-center justify-content-between p-3 border-bottom-1 surface-border">
          <span className="text-lg font-bold">UI Framework</span>
          <Dropdown
            value={framework}
            options={frameworkOptions}
            onChange={handleFrameworkChange}
            placeholder="프레임워크 선택"
            className="w-10rem"
          />
        </div>

        <Menu
          className="w-full border-none p-0"
          labelClassName="text-lg"
          model={menuItems}
        />
      </Panel>
    </Sidebar>
  )
}
