import { Badge } from '@/assets/js/PrimeReact';
import AssetIcon from '../common/AssetIcon';
import { classNames } from 'primereact/utils';

/**
 * 자산(계좌) 리스트 아이템 템플릿
 * @param {Object} props
 * @param {Object} props.item - 자산 데이터 객체 (accType, accCode, accLabel, accIcon, accDefault, accOrder, accMemo)
 * @param {Function} props.onClick - 아이템 클릭 핸들러
 */
export default function AssetListItem({ item, onClick }) {
  return (
    <div
      className={classNames('list-item col-12', { unused: item.accUnused })}
      onClick={onClick}
    >
      <i
        className="pi pi-bars drag-handle"
        style={{ cursor: 'grab' }}
        onClick={(e) => e.stopPropagation()}
      ></i>

      <AssetIcon icon={item.accIcon} className="text-xl" />

      <div className="flex-grow-1 flex flex-column gap-1">
        <div className="flex align-items-center column-gap-2">
          {item.accType && <Badge value={item.accType} severity="success" />}

          <span className="accLabel text-lg font-semibold">
            {item.accLabel}
          </span>

          {item.accDefault === true && <Badge value="기본계좌" />}
        </div>

        <div className="flex align-items-center gap-1">
          <span className="accMemo text-secondary text-sm">{item.accMemo}</span>
        </div>
      </div>

      <i className="pi pi-chevron-right"></i>
    </div>
  );
}
