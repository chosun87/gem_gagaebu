import { Button } from 'primereact/button'

export default function FloatingButton({ onClick }) {
  return (
    <Button
      className="floating-btn p-ripple"
      onClick={onClick}
      icon="pi pi-plus"
      rounded
      aria-label="거래 추가"
    />
  )
}
