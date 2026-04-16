import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from 'primereact/button'

export default function Footer({ onSettingsClick }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = (path) => {
    if (path === '/settings') {
      onSettingsClick()
    }
    navigate(path)
  }

  return (
    <footer className="app-footer">
      <Button
        className={`footer-menu-btn ${
          location.pathname === '/' || location.pathname === '/ledger'
            ? 'active'
            : ''
        }`}
        onClick={() => handleMenuClick('/')}
        icon="pi pi-book"
        iconPos="top"
        text
        unstyled={false}
      >
        <span>가계부</span>
      </Button>

      <Button
        className={`footer-menu-btn ${
          location.pathname === '/statistics' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('/statistics')}
        icon="pi pi-chart-bar"
        iconPos="top"
        text
        unstyled={false}
      >
        <span>통계</span>
      </Button>

      <Button
        className={`footer-menu-btn ${
          location.pathname === '/assets' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('/assets')}
        icon="pi pi-wallet"
        iconPos="top"
        text
        unstyled={false}
      >
        <span>자산</span>
      </Button>

      <Button
        className={`footer-menu-btn ${
          location.pathname === '/settings' ? 'active' : ''
        }`}
        onClick={() => handleMenuClick('/settings')}
        icon="pi pi-cog"
        iconPos="top"
        text
        unstyled={false}
      >
        <span>설정</span>
      </Button>
    </footer>
  )
}
