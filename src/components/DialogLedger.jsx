import { useState } from 'react';
import { useData } from '@/context/DataContext';
import {
  Button,
  Panel,
  Sidebar,
  confirmDialog,
  Dropdown,
  InputSwitch,
  Badge,
  ToggleButton,
} from '@/assets/js/PrimeReact';
import {
  Calendar as PrimeCalendar,
  InputNumber,
  InputText,
  SelectButton,
} from '@/assets/js/PrimeReact';
// import { locale, addLocale } from 'primereact/api';
import { classNames } from 'primereact/utils';
import dayjs from 'dayjs';

import { G_TYPE } from '@/assets/js/constants';

export default function DialogLedger({ ledger, visible, onHide, params }) {
  const {
    saveLedgerEntry,
    deleteLedgerEntry,
    loading: dataLoading,
    assetNodes,
    categoryOptions,
    defaultAssetCode,
  } = useData();

  const [gDate, set_gDate] = useState(new Date());
  const [gType, set_gType] = useState('');
  const [gAcc1, set_gAcc1] = useState('');
  const [gAcc2, set_gAcc2] = useState('');
  const [gCategory, set_gCategory] = useState('');
  const [gAmount, set_gAmount] = useState(0);
  const [gMemo, set_gMemo] = useState('');
  const [gExecuted, set_gExecuted] = useState(false);
  const [submitted, set_submitted] = useState(false);

  const [dateFocused, setDateFocused] = useState(false);

  // 이전 프로퍼티 추적 (React 추천 패턴: 렌더링 중 상태 조정)
  const [prevLedger, set_prevLedger] = useState(ledger);
  const [prevVisible, set_prevVisible] = useState(visible);
  const [prevParams, set_prevParams] = useState(params);

  if (
    ledger !== prevLedger ||
    visible !== prevVisible ||
    params !== prevParams
  ) {
    set_prevLedger(ledger);
    set_prevVisible(visible);
    set_prevParams(params);

    if (visible) {
      set_gDate(
        ledger?.gDate
          ? dayjs(ledger.gDate).toDate()
          : params?.date
            ? dayjs(params.date).toDate()
            : new Date(),
      );
      set_gType(ledger?.gType || params?.type || '지출');
      set_gAcc1(ledger?.gAcc1 || params?.accCode || defaultAssetCode || '');
      set_gAcc2(ledger?.gAcc2 || '');
      set_gCategory(ledger?.gCategory || params?.category || '');
      set_gAmount(ledger?.gAmount || 0);
      set_gMemo(ledger?.gMemo || '');
      set_gExecuted(ledger?.gExecuted || false);
      set_submitted(false);
    }
  }

  // 신규 입력일 때 날짜에 따라 실행 여부 자동 설정 (이것도 렌더링 중에 조정 가능)
  const [prevGDate, set_prevGDate] = useState(gDate);
  if (!ledger && gDate !== prevGDate) {
    set_prevGDate(gDate);
    const today = dayjs().startOf('day');
    const selectedDate = dayjs(gDate).startOf('day');
    set_gExecuted(!selectedDate.isAfter(today));
  }

  // Functions -------------------------------------------------------------------------------------
  const _getAccLabels = (type) => {
    switch (type) {
      case '수입':
        return ['입금계좌', ''];
      case '지출':
        return ['출금계좌', ''];
      case '이체':
        return ['출금계좌', '입금계좌'];
      default:
        return ['자산1', '자산2'];
    }
  };

  const [gAcc1Label, gAcc2Label] = _getAccLabels(gType);

  const fnSave = async () => {
    set_submitted(true);

    // 필수 항목 검증
    const isInvalid =
      !gDate ||
      !gType ||
      gAmount === 0 ||
      gAmount === null ||
      !gCategory ||
      !gAcc1 ||
      (gType === '이체' && !gAcc2);
    if (isInvalid) {
      return;
    }

    const formData = {
      ...ledger,
      gDate: dayjs(gDate).format('YYYY-MM-DD'),
      gType,
      gAcc1,
      gAcc2: gType === '이체' ? gAcc2 : '',
      gCategory,
      gAmount,
      gMemo,
      gExecuted,
    };

    try {
      await saveLedgerEntry(ledger, formData);
      onHide();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다. : ' + JSON.stringify(error));
    }
  };

  const fnDelete = () => {
    confirmDialog({
      message: '정말로 삭제하시겠습니까?',
      header: '삭제 확인',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '삭제',
      rejectLabel: '취소',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteLedgerEntry(ledger);
          onHide();
        } catch (error) {
          alert('삭제 중 오류가 발생했습니다. : ' + JSON.stringify(error));
        }
      },
    });
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateCategoryItem = (option) => {
    return (
      <div className="flex align-items-center">
        <i className={classNames(option.cdIcon, 'mr-2')} />
        <span>{option.cdLabel}</span>
      </div>
    );
  };

  const templateCategoryValue = (option, props) => {
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

  const templateAssetItem = (option) => {
    return (
      <div className="flex align-items-center">
        <i className={classNames(option.accIcon, 'mr-2')} />
        <span>{option.accLabel}</span>
      </div>
    );
  };

  const templateAssetValue = (option, props) => {
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

  const templateFooter = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary"
          size="large"
          outlined
          label="취소"
          onClick={onHide}
          disabled={dataLoading}
        />
        <Button
          severity="primary"
          size="large"
          label="저장"
          icon={dataLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
          onClick={fnSave}
          disabled={dataLoading}
        />
        <Button
          className={ledger === null ? 'hidden' : ''}
          severity="danger"
          size="large"
          tooltip="삭제"
          tooltipOptions={{ position: 'top' }}
          icon={dataLoading ? 'pi pi-spin pi-spinner' : 'pi pi-trash'}
          onClick={fnDelete}
          disabled={dataLoading}
        />
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-ledger shadow-7"
      header={<h3 className="dialog-title text-2xl">가계부 입력</h3>}
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel footerTemplate={templateFooter}>
        <div className="formWrap">
          <div className="formRow">
            <div className="inputWrap">
              <SelectButton
                id="gType"
                className={
                  'gType' + classNames({ 'p-invalid': submitted && !gType })
                }
                options={Object.values(G_TYPE)}
                value={gType}
                onChange={(e) => set_gType(e.target.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="gDate" className="required">
              날짜
            </label>
            <div className="inputWrap">
              <PrimeCalendar
                id="gDate"
                className={classNames({ 'p-invalid': submitted && !gDate })}
                locale="ko"
                dateFormat={dateFocused ? 'yymmdd' : 'yy-mm-dd (D)'}
                value={gDate}
                onChange={(e) => set_gDate(e.target.value)}
                onFocus={() => setDateFocused(true)}
                onBlur={() => setDateFocused(false)}
              />
              <div className="flex flex-nowrap ml-auto">
                <Badge
                  severity={gExecuted ? 'info' : 'secondary'}
                  className="mr-2 text-base"
                  value={gExecuted ? '실행 완료' : '실행 전'}
                />
                <InputSwitch
                  id="gExecuted"
                  checked={gExecuted}
                  trueValue={false}
                  falseValue={true}
                  onChange={(e) => set_gExecuted(e.value)}
                />
              </div>
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="gCategory" className="required">
              분류
            </label>
            <div className="inputWrap">
              <Dropdown
                id="gCategory"
                className={classNames('w-full', {
                  'p-invalid': submitted && !gCategory,
                })}
                placeholder="분류 선택"
                itemTemplate={templateCategoryItem}
                valueTemplate={templateCategoryValue}
                options={
                  categoryOptions.find((node) => node.cdGroup === gType)
                    ?.children || []
                }
                optionLabel="cdLabel"
                optionValue="cd"
                value={gCategory}
                onChange={(e) => {
                  set_gCategory(e.value);
                  const selectedCategory = categoryOptions
                    .find((node) => node.cdGroup === gType)
                    ?.children.find((c) => c.cd === e.value);
                  if (selectedCategory?.cdDefaultAcc1) {
                    set_gAcc1(selectedCategory.cdDefaultAcc1);
                  }
                }}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="gMemo">내용</label>
            <div className="inputWrap">
              <InputText
                id="gMemo"
                value={gMemo}
                onChange={(e) => set_gMemo(e.target.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="gAcc1" className="required">
              {gAcc1Label}
            </label>
            <div className="inputWrap">
              <Dropdown
                id="gAcc1"
                className={classNames('w-full', {
                  'p-invalid': submitted && !gAcc1,
                })}
                placeholder="자산 선택"
                options={assetNodes}
                optionLabel="accLabel"
                optionValue="accCode"
                optionGroupLabel="accType"
                optionGroupChildren="children"
                value={gAcc1}
                onChange={(e) => set_gAcc1(e.value)}
                itemTemplate={templateAssetItem}
                valueTemplate={templateAssetValue}
              />
            </div>
          </div>

          <div className={`formRow ${gType !== '이체' ? 'hidden' : ''}`}>
            <label htmlFor="gAcc2" className="required">
              {gAcc2Label}
            </label>
            <div className="inputWrap">
              <Dropdown
                id="gAcc2"
                className={classNames('w-full', {
                  'p-invalid': submitted && gType === '이체' && !gAcc2,
                })}
                placeholder="자산 선택"
                options={assetNodes}
                optionLabel="accLabel"
                optionValue="accCode"
                optionGroupLabel="accType"
                optionGroupChildren="children"
                value={gAcc2}
                onChange={(e) => set_gAcc2(e.value)}
                itemTemplate={templateAssetItem}
                valueTemplate={templateAssetValue}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="gAmount" className="required">
              금액
            </label>
            <div className="inputWrap">
              <div className="p-inputgroup w-full">
                <ToggleButton
                  onIcon="pi pi-minus"
                  onLabel=""
                  offIcon="pi pi-plus"
                  offLabel=""
                  tooltip="양수/음수 전환"
                  tooltipOptions={{ position: 'top' }}
                  checked={gAmount < 0}
                  onChange={(e) => {
                    set_gAmount((prev) => {
                      const val = Math.abs(prev || 0);
                      return e.value && val !== 0 ? -val : val;
                    });
                  }}
                />
                <InputNumber
                  id="gAmount"
                  className={classNames({
                    'p-invalid':
                      submitted && (gAmount === 0 || gAmount === null),
                  })}
                  mode="currency"
                  currency="KRW"
                  locale="ko-KR"
                  value={gAmount}
                  onValueChange={(e) => set_gAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </Sidebar>
  );
}
