import { useState, useMemo } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import FloatingButton from '../components/FloatingButton'
import TransactionDialog from '../components/TransactionDialog'
import TransactionList from '../components/TransactionList'

export default function LedgerPage() {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [sidebarVisible, setSidebarVisible] = useState(false)

  // Mock 거래 데이터
  const transactions = [
    {
      id: 1,
      gExecuted: true,
      gType: '수입',
      gDate: '2026-04-15',
      gAcc1: '급여통장',
      gCategory: '급여',
      gAmount: 3000000,
      gMemo: '4월 급여'
    },
    {
      id: 2,
      gExecuted: false,
      gType: '지출',
      gDate: '2026-04-15',
      gAcc1: '신용카드',
      gCategory: '식비',
      gAmount: 45000,
      gMemo: '저녁 식사'
    },
    {
      id: 3,
      gExecuted: true,
      gType: '지출',
      gDate: '2026-04-16',
      gAcc1: '체크카드',
      gCategory: '교통',
      gAmount: 2500,
      gMemo: '지하철'
    },
    {
      id: 4,
      gExecuted: true,
      gType: '이체',
      gDate: '2026-04-16',
      gAcc1: '급여통장',
      gAcc2: '저축통장',
      gAmount: 500000,
      gMemo: '정기 저축'
    },
    {
      id: 5,
      gExecuted: true,
      gType: '수입',
      gDate: '2026-04-16',
      gAcc1: '저축통장',
      gCategory: '이자',
      gAmount: 1500,
      gMemo: '월 이자'
    }
  ]

  // 날짜별 거래 합계 계산
  const dailyTotals = useMemo(() => {
    const totals = {}
    transactions.forEach(t => {
      if (!totals[t.gDate]) {
        totals[t.gDate] = { 수입: 0, 지출: 0, 이체: 0, hasUnexecuted: false }
      }
      if (t.gExecuted) {
        totals[t.gDate][t.gType] += t.gAmount
      } else {
        totals[t.gDate].hasUnexecuted = true
      }
    })
    return totals
  }, [])

  // FullCalendar 이벤트 렌더링 콘텐츠
  const eventContent = (info) => {
    const date = info.date.toISOString().split('T')[0]
    const dayNum = info.date.getDate()
    const total = dailyTotals[date]
    const hasUnexecuted = total?.hasUnexecuted ? ' *' : ''

    return (
      <div className="fc-daygrid-cell-content">
        <div className="date-number">{dayNum}{hasUnexecuted}</div>
        {total && (
          <div className="daily-totals">
            {total.수입 > 0 && <div className="daily-amount color-blue">{(total.수입 / 10000).toFixed(0)}만</div>}
            {total.지출 > 0 && <div className="daily-amount color-red">{(total.지출 / 10000).toFixed(0)}만</div>}
            {total.이체 > 0 && <div className="daily-amount color-green">{(total.이체 / 10000).toFixed(0)}만</div>}
          </div>
        )}
      </div>
    )
  }

  // 캘린더 날짜 클릭 핸들러
  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr)
    setSidebarVisible(true)
  }

  const handleFloatingButtonClick = () => {
    setDialogVisible(true)
  }

  const handleDialogClose = () => {
    setDialogVisible(false)
  }

  // 선택된 날짜의 거래 필터링
  const selectedDateTransactions = selectedDate
    ? transactions.filter(t => t.gDate === selectedDate)
    : []

  return (
    <div className="ledger-page">
      <TabView>
        <TabPanel header="달력" leftIcon="pi pi-calendar">
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale="ko"
              dayCellContent={eventContent}
              dateClick={handleDateClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
              }}
            />
          </div>
        </TabPanel>

        <TabPanel header="목록" leftIcon="pi pi-list">
          <div className="list-container">
            <TransactionList transactions={transactions} />
          </div>
        </TabPanel>
      </TabView>

      <FloatingButton onClick={handleFloatingButtonClick} />

      <TransactionDialog
        visible={dialogVisible}
        onClose={handleDialogClose}
      />

      {/* 날짜별 거래 Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="bottom"
        header={selectedDate}
        modal
      >
        <TransactionList transactions={selectedDateTransactions} />
      </Sidebar>
    </div>
  )
}
