import { Badge, InputSwitch } from '@/assets/js/PrimeReact';
import dayjs from 'dayjs';

/**
 * 가계부 리스트 아이템 템플릿 (MonthlyList, DialogList 공용)
 * @param {Object} props
 * @param {Object} props.item - 가계부 데이터 객체
 * @param {string} props.dateFormat - 날짜 포맷 (dayjs format string)
 * @param {boolean} props.showDate - 날짜 표시 여부 (default: true)
 * @param {Function} props.onClick - 아이템 클릭 핸들러
 * @param {Function} props.onExecuteChange - 실행 상태 변경 핸들러
 */
export default function LedgerListItem({
  item,
  dateFormat = 'YY-MM-DD',
  showDate = true,
  onClick,
  onExecuteChange,
}) {
  const gTypeClass = `gType-${item.gType}`;
  const gExecutedClass = `gExecuted-${item.gExecuted ? 'Y' : 'N'}`;

  return (
    <div
      className={`list-item ${gTypeClass} ${gExecutedClass} col-12`}
      onClick={onClick}
    >
      <Badge
        className={`gType-${item.gType} text-base`}
        value={item.gCategory}
      />

      <div className="flex-grow-1 flex flex-column gap-1">
        <div className="flex align-items-center column-gap-2">
          {showDate && (
            <span className="gDate text-lg font-semibold monospace">
              {dayjs(item.gDate).format(dateFormat)}
            </span>
          )}
          <span className="gAcc text-secondary text-sm">
            {item.gAcc2 ? `${item.gAcc1}→${item.gAcc2}` : item.gAcc1}
          </span>
        </div>
        <div className="flex align-items-center gap-1">
          <span className="gMemo">{item.gMemo}</span>
        </div>
      </div>

      <div className="gAmount monospace text-right text-lg font-bold">
        {(item?.gAmount || 0).toLocaleString()}
        <span className="unit text-xs">원</span>
      </div>

      <InputSwitch
        checked={item.gExecuted}
        trueValue={false}
        falseValue={true}
        tooltip="실행"
        tooltipOptions={{ position: 'top' }}
        onChange={(e) => onExecuteChange(item, e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
