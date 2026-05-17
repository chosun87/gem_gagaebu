import { Sidebar, Panel, Button } from '@/assets/js/PrimeReact'

export default function DialogSampleBottom({ visible, onHide }) {
  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateFooter = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary"
          size="large"
          outlined
          label="Cancel"
          onClick={onHide}
        />
        <Button severity="primary" size="large" label="OK" onClick={onHide} />
      </div>
    )
  }

  return (
    <Sidebar
      className="dialog-sample-bottom shadow-7"
      header={<h3 className="dialog-title text-2xl">하단 사이드바</h3>}
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel footerTemplate={templateFooter}>
        <div>
          하단에서 나오는 사이드바 내용입니다. DialogAI.jsx 구조를 참고했습니다.
          Footer에 'Cancel', 'OK' 버튼을 배치했습니다.
        </div>
      </Panel>
    </Sidebar>
  )
}
