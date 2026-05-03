import { classNames } from 'primereact/utils';

export const templateCategoryItem = (option) => {
  return (
    <div className="flex align-items-center">
      <i className={classNames(option.cdIcon, 'mr-2')} />
      <span>{option.cdLabel}</span>
    </div>
  );
};

export const templateCategoryValue = (option, props) => {
  if (option) {
    return (
      <div className="flex align-items-center">
        <i className={classNames(option.cdIcon, 'mr-2')} />
        <span>{option.cdLabel}</span>
      </div>
    );
  }
  return <span>{props.placeholder}</span>;
};

export const templateAssetItem = (option) => {
  return (
    <div className="flex align-items-center">
      <i className={classNames(option.accIcon, 'mr-2')} />
      <span>{option.accLabel}</span>
    </div>
  );
};

export const templateAssetValue = (option, props) => {
  if (option) {
    return (
      <div className="flex align-items-center">
        <i className={classNames(option.accIcon, 'mr-2')} />
        <span>{option.accLabel}</span>
      </div>
    );
  }
  return <span>{props.placeholder}</span>;
};
