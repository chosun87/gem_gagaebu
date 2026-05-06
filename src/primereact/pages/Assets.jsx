import { Panel } from '@/assets/js/PrimeReact';

export default function Assets() {
  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Panel
      className="app-page assets-page"
      header={<h2 className="page-title text-3xl">자산</h2>}
    >
      <div>자산 화면입니다.</div>
    </Panel>
  );
}
