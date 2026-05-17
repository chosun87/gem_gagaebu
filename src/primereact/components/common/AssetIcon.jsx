import { classNames } from 'primereact/utils'

/**
 * 자산 아이콘 렌더링 컴포넌트
 * - 'bank:이름' 형식인 경우 /icon/bank/SVG/금융아이콘_SVG_{이름}.svg 사용
 * - 그 외에는 PrimeIcons (pi pi-*) 클래스 사용
 */
export default function AssetIcon({ icon, className, style }) {
  const isSvg = icon && (icon.endsWith('.svg') || icon.endsWith('.png'))

  if (isSvg) {
    const fileName = icon
    // 한글 파일명의 경우 URL 인코딩이 필요할 수 있음
    const encodedFileName = fileName
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/')
    // Vite의 BASE_URL을 사용하여 환경에 맞는 루트 경로 적용 (vite.config.js의 base 설정 연동)
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') // 끝에 붙은 슬래시 제거
    const src = `${baseUrl}/icon/bank/SVG/${encodedFileName}`

    return (
      <img
        src={src}
        alt={fileName}
        className={classNames('asset-icon-svg', className)}
        onError={(e) => {
          // 이미지 로드 실패 시 기본 아이콘으로 대체
          e.target.onerror = null
          e.target.src = ''
          e.target.style.display = 'none'
        }}
      />
    )
  }

  // 기본 PrimeIcons 처리
  return (
    <i
      className={classNames(icon || 'pi pi-wallet', className)}
      style={{ fontSize: '1.2rem', verticalAlign: 'middle', ...style }}
    />
  )
}
