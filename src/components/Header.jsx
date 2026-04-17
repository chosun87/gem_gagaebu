import { Button } from '@/components/PrimeReact';

export default function Header() {
  return (
    <header className="app-header shadow-2">
      <h1 className="app-header-title">가계부</h1>
      <div className="app-header-buttons">
        <Button className="refresh" icon="pi pi-refresh" severity="primary" rounded text raised size="small"
          tooltip="새로고침"
          tooltipOptions={{ position: 'left' }}
        />
        <Button className="login" icon="pi pi-user" severity="primary" rounded text raised size="small"
          tooltip="로그인"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
    </header>
  );
}
