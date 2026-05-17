import { classNames } from 'primereact/utils'
import AssetIcon from './AssetIcon'

export const templateCategoryItem = (option) => {
  return (
    <div className="flex align-items-center">
      <i className={classNames(option.cdIcon, 'mr-2')} />
      <span>{option.cdLabel}</span>
    </div>
  )
}

export const templateCategoryValue = (option, props) => {
  if (option) {
    return (
      <div className="flex align-items-center">
        <i className={classNames(option.cdIcon, 'mr-2')} />
        <span>{option.cdLabel}</span>
      </div>
    )
  }
  return <span>{props.placeholder}</span>
}

export const templateAssetItem = (option) => {
  return (
    <div className="flex align-items-center">
      <AssetIcon icon={option.accIcon} className="mr-2" />
      <span>{option.accLabel}</span>
    </div>
  )
}

export const templateAssetValue = (option, props) => {
  if (option) {
    return (
      <div className="flex align-items-center">
        <AssetIcon icon={option.accIcon} className="mr-2" />
        <span>{option.accLabel}</span>
      </div>
    )
  }
  return <span>{props.placeholder}</span>
}
