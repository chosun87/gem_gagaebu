import { useState } from 'react'
import { useData } from '@/context/DataContext'
import {
  Button,
  Panel,
  Sidebar,
  Dropdown,
  InputSwitch,
  InputText,
} from '@/assets/js/PrimeReact'
import { showNotice, showConfirm, showError } from '@/assets/js/dialogUtils'
import { classNames } from 'primereact/utils'
import AssetIcon from '@/components/common/AssetIcon'

export default function DialogAsset({ asset, visible, onHide }) {
  const {
    saveAssetEntry,
    deleteAssetEntry,
    loading: dataLoading,
    assetOptions,
  } = useData()

  const [accType, set_accType] = useState('')
  const [accCode, set_accCode] = useState('')
  const [accLabel, set_accLabel] = useState('')
  const [accIcon, set_accIcon] = useState('')
  const [accDefault, set_accDefault] = useState(false)
  const [accOrder, set_accOrder] = useState(0)
  const [accMemo, set_accMemo] = useState('')
  const [accUnused, set_accUnused] = useState(false)
  const [submitted, set_submitted] = useState(false)

  // 다이얼로그가 열릴 때 상태 초기화
  const fnOnShow = () => {
    set_accType(asset?.accType || '')
    set_accCode(asset?.accCode || '')
    set_accLabel(asset?.accLabel || '')
    set_accIcon(asset?.accIcon || 'pi pi-wallet')
    set_accDefault(asset?.accDefault || false)
    set_accOrder(asset?.accOrder || 0)
    set_accMemo(asset?.accMemo || '')
    set_accUnused(asset?.accUnused || false)
    set_submitted(false)
  }

  // Functions -------------------------------------------------------------------------------------
  const fnSave = async () => {
    set_submitted(true)

    // 필수 항목 검증
    const isInvalid = !accType || !accCode || !accLabel
    if (isInvalid) {
      return
    }

    const formData = {
      ...asset,
      accType,
      accCode,
      accLabel,
      accIcon,
      accDefault,
      accOrder,
      accMemo,
      accUnused,
    }

    try {
      await saveAssetEntry(formData)
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
          await deleteAssetEntry(asset)
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
          className={asset === null ? 'hidden' : ''}
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
      className="dialog-asset shadow-7"
      header={
        <h3 className="dialog-title text-2xl">
          {asset ? '자산 수정' : '자산 추가'}
        </h3>
      }
      position="bottom"
      visible={visible}
      onHide={onHide}
      onShow={fnOnShow}
    >
      <Panel footerTemplate={templateFooter}>
        <div className="formWrap">
          <div className="formRow">
            <label htmlFor="accType" className="required">
              자산 유형
            </label>
            <div className="inputWrap">
              <Dropdown
                id="accType"
                className={classNames('w-full', {
                  'p-invalid': submitted && !accType,
                })}
                options={assetOptions}
                optionLabel="cdLabel"
                optionValue="cd"
                placeholder="자산 유형 선택"
                value={accType}
                onChange={(e) => set_accType(e.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="accCode" className="required">
              자산 코드
            </label>
            <div className="inputWrap">
              <InputText
                id="accCode"
                className={classNames('w-full', {
                  'p-invalid': submitted && !accCode,
                })}
                placeholder="고유 코드 (예: CASH, SH_BANK...)"
                value={accCode}
                onChange={(e) => set_accCode(e.target.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="accLabel" className="required">
              자산명
            </label>
            <div className="inputWrap">
              <InputText
                id="accLabel"
                className={classNames('w-full', {
                  'p-invalid': submitted && !accLabel,
                })}
                placeholder="표시될 이름"
                value={accLabel}
                onChange={(e) => set_accLabel(e.target.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="accIcon">아이콘</label>
            <div className="inputWrap">
              <div className="p-inputgroup w-full">
                <span className="p-inputgroup-addon">
                  <AssetIcon icon={accIcon} />
                </span>
                <InputText
                  id="accIcon"
                  placeholder="PrimeIcons 클래스 (예: pi pi-wallet)"
                  value={accIcon}
                  onChange={(e) => set_accIcon(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="accMemo">메모</label>
            <div className="inputWrap">
              <InputText
                id="accMemo"
                className="w-full"
                value={accMemo}
                onChange={(e) => set_accMemo(e.target.value)}
              />
            </div>
          </div>

          <div className="formRow">
            <label htmlFor="">계좌 상태</label>
            <div className="inputWrap flex align-items-center gap-2">
              <label htmlFor="accDefault">기본계좌</label>
              <InputSwitch
                id="accDefault"
                checked={accDefault}
                onChange={(e) => set_accDefault(e.value)}
              />

              <label htmlFor="accUnused" className="ml-auto">
                미사용 계좌
              </label>
              <InputSwitch
                id="accUnused"
                checked={accUnused}
                onChange={(e) => set_accUnused(e.value)}
              />
            </div>
          </div>
        </div>
      </Panel>
    </Sidebar>
  )
}
