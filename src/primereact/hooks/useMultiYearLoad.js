import { useEffect } from 'react'
import { useData } from '@/context/DataContext'

/**
 * 여러 연도의 데이터를 로드하는 커스텀 훅
 * @param {boolean} visible - 다이얼로그 노출 여부
 * @param {Object} params - 파라미터 (startYear, endYear 포함)
 */
export function useMultiYearLoad(visible, params) {
  const { loadedSheetYYYY, loadSheet연도Data } = useData()

  useEffect(() => {
    if (
      visible &&
      params?.startYear &&
      params?.endYear &&
      params?.startYear !== params?.endYear
    ) {
      for (let y = params.startYear; y <= params.endYear; y++) {
        const yearStr = y.toString()
        if (!loadedSheetYYYY[yearStr]) {
          loadSheet연도Data(yearStr)
        }
      }
    }
  }, [
    visible,
    params?.startYear,
    params?.endYear,
    loadedSheetYYYY,
    loadSheet연도Data,
  ])
}
