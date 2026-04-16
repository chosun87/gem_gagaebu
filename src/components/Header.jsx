import { Button } from 'primereact/button'

export default function Header() {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <header className="app-header">
      <h1 className="app-header-title">gem_gagaebu</h1>
      <div className="app-header-actions">
        <Button
          className="reload-btn p-ripple"
          onClick={handleReload}
          icon="pi pi-refresh"
          text
          rounded
          aria-label="데이터 새로고침"
        />
      </div>
    </header>
  )
}
