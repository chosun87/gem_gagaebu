import { Panel } from '@/assets/js/PrimeReact'
import { useData } from '@/context/DataContext'
import { useMonthSync } from '@/hooks/useMonthSync'
import MonthNavigator from '@/components/common/MonthNavigator'
import dayjs from 'dayjs'

export default function BlankMonthly() {
  const { selectedDate } = useData()

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const { handleMonthChange, handleViewDateChange } = useMonthSync(
    '/samples/blankMonthly',
  )

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <Panel
      className="app-page"
      header={<h2 className="page-title text-3xl">빈 페이지</h2>}
    >
      <div className="panel-content p-0">
        <MonthNavigator
          selectedDate={selectedDate}
          onMonthChange={handleMonthChange}
          onViewDateChange={handleViewDateChange}
        />

        <section className="panel-body">
          <div>월별 이동 기능이 포함된 빈 페이지 템플릿입니다.</div>
          <div>
            현재 선택된 월 :{' '}
            <strong>{dayjs(selectedDate).format('YYYY-MM')}</strong>
          </div>
        </section>
      </div>
    </Panel>
  )
}
