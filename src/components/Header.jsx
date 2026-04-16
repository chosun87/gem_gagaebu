import { Button } from '@/components/PrimeReact';

export default function Header() {
  return (
    <header className="app-header">
      <h1 className="app-header-title">가계부</h1>
      <div className="app-header-buttons">
        <Button label="Reload" icon="pi pi-refresh" severity="secondary" outlined size="small" />
        <Button label="로그인" icon="pi pi-user" size="small" />
      </div>
    </header>
  );
}
