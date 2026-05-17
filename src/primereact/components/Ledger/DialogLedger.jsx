import { useState } from 'react'
import { useData } from '@/context/DataContext'
import {
  Button,
  Panel,
  Sidebar,
  Dropdown,
  InputSwitch,
  Badge,
  ToggleButton,
  Calendar as PrimeCalendar,
  InputNumber,
  InputText,
  SelectButton,
} from '@/assets/js/PrimeReact'
import { showNotice, showConfirm, showError } from '@/assets/js/dialogUtils'
import {
  templateCategoryItem,
  templateCategoryValue,
  templateAssetItem,
  templateAssetValue,
} from '@/components/common/SelectTemplates'
import { classNames } from 'primereact/utils'
import dayjs from 'dayjs'
import { TRANSACTION_TYPE, G_TYPE } from '@/assets/js/constants'

export default function DialogLedger({ ledger, visible, onHide, params }) {
  const {
    saveLedgerEntry,
    deleteLedgerEntry,
    loading: dataLoading,
    assetNodes,
    categoryOptions,
    defaultAssetCode,
  } = useData()

  const [gDate, set_gDate] = useState(new Date())
  const [gType, set_gType] = useState('')
  const [gAcc1, set_gAcc1] = useState('')
  const [gAcc2, set_gAcc2] = useState('')
  const [gCategory, set_gCategory] = useState('')
  const [gAmount, set_gAmount] = useState(0)
  const [gMemo, set_gMemo] = useState('')
  const [gExecuted, set_gExecuted] = useState(false)
  const [submitted, set_submitted] = useState(false)

  const [dateFocused, setDateFocused] = useState(false)

  // 다이얼로그가 열릴 때 상태 초기화
  const fnOnShow = () => {
    const initialDate = ledger?.gDate
      ? dayjs(ledger.gDate).toDate()
      : params?.date
        ? dayjs(params.date).toDate()
        : new Date()

    set_gDate(initialDate)
    set_gType(ledger?.gType || params?.type || TRANSACTION_TYPE.EXPENSE)
    set_gAcc1(ledger?.gAcc1 || params?.accCode || defaultAssetCode || '')
    set_gAcc2(ledger?.gAcc2 || '')
    set_gCategory(ledger?.gCategory || params?.category || '')
    set_gAmount(ledger?.gAmount || 0)
    set_gMemo(ledger?.gMemo || '')
    // 실행 여부 초기화
    if (ledger) {
      set_gExecuted(ledger.gExecuted || false)
    } else {
      const today = dayjs().startOf('day')
      const selectedDate = dayjs(initialDate).startOf('day')
      set_gExecuted(!selectedDate.isAfter(today))
    }

    set_submitted(false)
  }

  // Functions -------------------------------------------------------------------------------------
  const _getAccLabels = (type) => {
    switch (type) {
      case TRANSACTION_TYPE.INCOME:
        return ['입금계좌', '']
      case TRANSACTION_TYPE.EXPENSE:
        return ['출금계좌', '']
      case TRANSACTION_TYPE.TRANSFER:
        return ['출금계좌', '입금계좌']
      default:
        return ['자산1', '자산2']
    }
  }

  const [gAcc1Label, gAcc2Label] = _getAccLabels(gType)

  const fnSave = async () => {
    set_submitted(true)

    // 필수 항목 검증
    const isInvalid =
      !gDate ||
      !gType ||
      gAmount === 0 ||
      gAmount === null ||
      !gCategory ||
      !gAcc1 ||
      (gType === TRANSACTION_TYPE.TRANSFER && !gAcc2)
    if (isInvalid) {
      return
    }

    const formData = {
      ...ledger,
      gDate: dayjs(gDate).format('YYYY-MM-DD'),
      gType,
      gAcc1,
      gAcc2: gType === TRANSACTION_TYPE.TRANSFER ? gAcc2 : '',
      gCategory,
      gAmount,
      gMemo,
      gExecuted,
    }

    try {
      await saveLedgerEntry(ledger, formData)
      showNotice({
        header: '처리 완료',
        message: '저장되었습니다.',
        accept: () => onHide(),
      })
    } catch (error) {
      showError(error, '저장 오류')
    }
  }

  const fnDelete = () => {
    showConfirm({
      header: '삭제 확인',
      message: '정말로 삭제하시겠습니까?',
      acceptLabel: '삭제',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteLedgerEntry(ledger)
          showNotice({
            header: '처리 완료',
            message: '삭제되었습니다.',
            accept: () => onHide(),
          })
        } catch (error) {
          showError(error, '삭제 오류')
        }
      },
    })
  }

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------

  const templateFooter = (options) => {
    return (
      <div className={options.className}>
        <Button
          severity="secondary"
          size="large"
          outlined
          label="닫기"
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
    )
  }

  return (
    <Sidebar
      className="dialog-ledger shadow-7"
      header={<h3 className="dialog-title text-2xl">가계부 입력</h3>}
      position="bottom"
      visible={visible}
      onHide={onHide}
      onShow={fnOnShow}
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
                onChange={(e) => {
                  const newDate = e.value
                  set_gDate(newDate)
                  // 신규 입력일 때만 날짜에 따라 실행 여부 자동 설정
                  if (!ledger) {
                    const today = dayjs().startOf('day')
                    const selectedDate = dayjs(newDate).startOf('day')
                    set_gExecuted(!selectedDate.isAfter(today))
                  }
                }}
                onFocus={() => setDateFocused(true)}
                onBlur={() => setDateFocused(false)}
              />
              <div className="flex align-items-center flex-nowrap ml-auto">
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
                  set_gCategory(e.value)
                  const selectedCategory = categoryOptions
                    .find((node) => node.cdGroup === gType)
                    ?.children.find((c) => c.cd === e.value)
                  if (selectedCategory?.cdDefaultAcc1) {
                    set_gAcc1(selectedCategory.cdDefaultAcc1)
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

          <div
            className={`formRow ${gType !== TRANSACTION_TYPE.TRANSFER ? 'hidden' : ''}`}
          >
            <label htmlFor="gAcc2" className="required">
              {gAcc2Label}
            </label>
            <div className="inputWrap">
              <Dropdown
                id="gAcc2"
                className={classNames('w-full', {
                  'p-invalid':
                    submitted && gType === TRANSACTION_TYPE.TRANSFER && !gAcc2,
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
                      const val = Math.abs(prev || 0)
                      return e.value && val !== 0 ? -val : val
                    })
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
  )
}
