import { Calendar as PrimeCalendar, Dropdown } from '@/assets/js/PrimeReact'

const templateMonthNavigator = (e) => (
  <Dropdown
    className="month-dropdown"
    value={e.value}
    options={e.options}
    onChange={(event) => e.onChange(event.originalEvent, event.value)}
  />
)

const templateYearNavigator = (e) => (
  <Dropdown
    className="year-dropdown"
    value={e.value}
    options={e.options}
    onChange={(event) => e.onChange(event.originalEvent, event.value)}
  />
)

export default function MonthNavigator({
  selectedDate,
  onMonthChange,
  onViewDateChange,
}) {
  return (
    <PrimeCalendar
      className="month-calendar"
      inline
      locale="ko"
      yearNavigator
      yearNavigatorTemplate={templateYearNavigator}
      monthNavigator
      monthNavigatorTemplate={templateMonthNavigator}
      value={selectedDate}
      onMonthChange={onMonthChange}
      onViewDateChange={onViewDateChange}
    />
  )
}
