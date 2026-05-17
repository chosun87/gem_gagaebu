import { useState } from 'react'
import { Panel, Button } from '@/assets/js/PrimeReact'
import DialogSampleBottom from '@/samples/components/DialogSampleBottom'

export default function BlankSidebarBottom() {
  const [visible, setVisible] = useState(false)

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Panel
      className="app-page blank-sidebar-bottom-page"
      header={<h2 className="page-title text-3xl">하단 사이드바 템플릿</h2>}
    >
      <div className="flex flex-column align-items-center justify-content-center py-5">
        <Button
          label="하단 사이드바 열기"
          icon="pi pi-arrow-up"
          onClick={() => setVisible(true)}
        />
      </div>

      <DialogSampleBottom visible={visible} onHide={() => setVisible(false)} />
    </Panel>
  )
}
