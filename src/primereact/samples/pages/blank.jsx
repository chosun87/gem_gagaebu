import { Panel } from '@/assets/js/PrimeReact'

export default function Blank() {
  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Panel
      className="app-page"
      header={<h2 className="page-title text-3xl">빈 페이지</h2>}
    >
      <div>빈 페이지 템플릿입니다.</div>
    </Panel>
  )
}
