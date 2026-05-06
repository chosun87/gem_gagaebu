import { useState } from 'react';
import { Panel, Button } from '@/assets/js/PrimeReact';
import DialogSampleRight from '@/samples/components/DialogSampleRight';

export default function BlankSidebarRight() {
  const [visible, setVisible] = useState(false);

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Panel
      className="app-page blank-sidebar-right-page"
      header={<h2 className="page-title text-3xl">우측 사이드바 템플릿</h2>}
    >
      <div className="flex flex-column align-items-center justify-content-center py-5">
        <Button
          label="우측 사이드바 열기"
          icon="pi pi-arrow-left"
          onClick={() => setVisible(true)}
        />
      </div>

      <DialogSampleRight visible={visible} onHide={() => setVisible(false)} />
    </Panel>
  );
}
