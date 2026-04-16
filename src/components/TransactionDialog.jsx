import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

export default function TransactionDialog({ visible, onClose }) {
  const footerContent = (
    <div>
      <Button label="닫기" size="small" onClick={onClose} />
      <Button label="삭제" severity="secondary" size="small" />
      <Button label="저장" severity="primary" size="small" />
    </div>
  )

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header="거래 입력"
      modal
      position="bottom"
      footer={footerContent}
    >
      <div className="form-placeholder">
        <p>거래 입력 폼은 3단계에서 구작성됩니다.</p>
        <p>폼 필드:</p>
        <ul>
          <li>구분 (수입/지출/이체)</li>
          <li>날짜</li>
          <li>자산 (계좌)</li>
          <li>분류</li>
          <li>금액</li>
          <li>내용</li>
        </ul>
        <Button label="Submit" />
      </div>
    </Dialog>
  )
}
