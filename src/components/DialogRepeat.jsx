import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Button, Panel, Sidebar, TreeSelect, ConfirmDialog, confirmDialog, Calendar as PrimeCalendar, InputNumber, InputText, SelectButton, Dropdown } from '@/components/PrimeReact';
import { locale, addLocale } from 'primereact/api';
import { classNames } from 'primereact/utils';
import dayjs from 'dayjs';

import { RP_TYPE } from '@/assets/js/constants';

export default function DialogRepeat({ repeat, visible, onHide }) {

  const { saveRepeatEntry, deleteRepeatEntry, loading: dataLoading, assetNodes, categoryOptions, defaultAssetCode, periodOptions } = useData();

  const [rpType, set_rpType] = useState(repeat?.rpType || '');
  const [rpDateS, set_rpDateS] = useState(repeat?.rpDateS ? dayjs(repeat.rpDateS).toDate() : new Date());
  const [rpDateE, set_rpDateE] = useState(repeat?.rpDateE ? dayjs(repeat.rpDateE).toDate() : new Date());
  const [rpPeriod, set_rpPeriod] = useState(repeat?.rpPeriod || 'M');
  const [rpDay, set_rpDay] = useState(repeat?.rpDay ? String(repeat.rpDay) : '1');
  const [rpAcc1, set_rpAcc1] = useState(repeat?.rpAcc1 || '');
  const [rpAcc2, set_rpAcc2] = useState(repeat?.rpAcc2 || '');
  const [rpCategory, set_rpCategory] = useState(repeat?.rpCategory || '');
  const [rpAmount, set_rpAmount] = useState(repeat?.rpAmount || 0);
  const [rpTotalAmount, set_rpTotalAmount] = useState(repeat?.rpTotalAmount || 0);
  const [rpMemo, set_rpMemo] = useState(repeat?.rpMemo || '');
  const [rpComplete, set_rpComplete] = useState(repeat?.rpComplete || false);

  const [rpAcc1Label, set_rpAcc1Label] = useState('자산1');
  const [rpAcc2Label, set_rpAcc2Label] = useState('자산2');
  const [submitted, set_submitted] = useState(false);

  // 반복일 옵션 정의
  const monthDays = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}일`, value: String(i + 1) }));
  const weekDays = [
    { label: '월요일', value: '월' },
    { label: '화요일', value: '화' },
    { label: '수요일', value: '수' },
    { label: '목요일', value: '목' },
    { label: '금요일', value: '금' },
    { label: '토요일', value: '토' },
    { label: '일요일', value: '일' }
  ];

  useEffect(() => {
    if (visible) {
      set_rpType(repeat?.rpType || '지출');
      set_rpDateS(repeat?.rpDateS ? dayjs(repeat.rpDateS).toDate() : new Date());
      set_rpDateE(repeat?.rpDateE ? dayjs(repeat.rpDateE).toDate() : dayjs().add(1, 'year').toDate());
      set_rpPeriod(repeat?.rpPeriod || 'M');
      set_rpDay(repeat?.rpDay ? String(repeat.rpDay) : '1');
      set_rpAcc1(repeat?.rpAcc1 || defaultAssetCode || '');
      set_rpAcc2(repeat?.rpAcc2 || '');
      set_rpCategory(repeat?.rpCategory || '');
      set_rpAmount(repeat?.rpAmount || 0);
      set_rpTotalAmount(repeat?.rpTotalAmount || 0);
      set_rpMemo(repeat?.rpMemo || '');
      set_rpComplete(repeat?.rpComplete || false);
      set_submitted(false);

      const [acc1Label, acc2Label] = _getAccLabels(repeat?.rpType || '지출');
      set_rpAcc1Label(acc1Label);
      set_rpAcc2Label(acc2Label);
    }
  }, [repeat, visible, defaultAssetCode]);

  useEffect(() => {
    const [acc1Label, acc2Label] = _getAccLabels(rpType);
    set_rpAcc1Label(acc1Label);
    set_rpAcc2Label(acc2Label);
  }, [rpType]);

  const _getAccLabels = (type) => {
    switch (type) {
      case '수입': return ['입금계좌', '']
      case '지출': return ['출금계좌', '']
      case '이체': return ['출금계좌', '입금계좌']
      default: return ['자산1', '자산2']
    }
  }

  const calculateTotalAmount = () => {
    if (!rpDateS || !rpDateE || !rpAmount || !rpPeriod || !rpDay) return;

    let count = 0;
    const start = dayjs(rpDateS);
    const end = dayjs(rpDateE);

    if (rpPeriod === 'M') {
      const day = parseInt(rpDay);
      // 시작 월부터 종료 월까지 루프
      let temp = start.date(day);
      if (temp.isBefore(start, 'day')) temp = temp.add(1, 'month');

      while (temp.isBefore(end) || temp.isSame(end, 'day')) {
        count++;
        temp = temp.add(1, 'month');
      }
    } else if (rpPeriod === 'W') {
      const dayOfWeekMap = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
      const dayOfWeek = dayOfWeekMap[rpDay];

      let temp = start.day(dayOfWeek);
      if (temp.isBefore(start, 'day')) temp = temp.add(1, 'week');

      while (temp.isBefore(end) || temp.isSame(end, 'day')) {
        count++;
        temp = temp.add(1, 'week');
      }
    }

    set_rpTotalAmount(count * rpAmount);
  };

  const onSave = async () => {
    set_submitted(true);

    // 필수 항목 검증
    const isInvalid = !rpDateS || !rpPeriod || !rpDay || !rpType || (rpAmount === 0 || rpAmount === null) || !rpCategory || !rpAcc1 || (rpType === '이체' && !rpAcc2);
    if (isInvalid) {
      return;
    }

    const formData = {
      ...repeat,
      rpType,
      rpDateS,
      rpDateE,
      rpPeriod,
      rpDay,
      rpAcc1,
      rpAcc2: rpType === '이체' ? rpAcc2 : '',
      rpCategory,
      rpAmount,
      rpTotalAmount,
      rpMemo,
      rpComplete
    };

    try {
      await saveRepeatEntry(repeat, formData);
      onHide();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const onDelete = () => {
    confirmDialog({
      message: '정말로 삭제하시겠습니까?',
      header: '삭제 확인',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: '삭제',
      rejectLabel: '취소',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await deleteRepeatEntry(repeat);
          onHide();
        } catch (error) {
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    });
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const categoryItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <i className={classNames(option.cdIcon, 'mr-2')} />
        <span>{option.cdLabel}</span>
      </div>
    );
  };

  const categoryValueTemplate = (option, props) => {
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

  const assetItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <i className={classNames(option.accIcon, 'mr-2')} />
        <span>{option.accLabel}</span>
      </div>
    );
  };

  const assetValueTemplate = (option, props) => {
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
          severity="secondary" size="large" outlined label="취소"
          onClick={onHide}
          disabled={dataLoading}
        />
        <Button
          severity="primary" size="large" label="저장"
          icon={dataLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
          onClick={onSave}
          disabled={dataLoading}
        />
        <Button className={(repeat === null) ? 'hidden' : ''}
          severity="danger" size="large"
          tooltip="삭제"
          tooltipOptions={{ position: 'top' }}
          icon={dataLoading ? "pi pi-spin pi-spinner" : "pi pi-trash"}
          onClick={onDelete}
          disabled={dataLoading}
        />
      </div>
    );
  };

  return (
    <Sidebar
      className="dialog-repeat shadow-7"
      header={<h3 className="dialog-title text-2xl">반복 내역 설정</h3>}
      position="bottom"
      visible={visible}
      onHide={onHide}
    >
      <Panel
        footerTemplate={templateFooter}
      >
        <div className="formWrap">
          <div className="inputWrap">
            <SelectButton id="rpType" size="large"
              className={classNames({ 'p-invalid': submitted && !rpType })}
              options={Object.values(RP_TYPE)}
              value={rpType}
              onChange={(e) => set_rpType(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpDateS" className="required">기간</label>
            <div className="flex align-items-center gap-2">
              <PrimeCalendar id="rpDateS"
                className={classNames('flex-grow-1', { 'p-invalid': submitted && !rpDateS })}
                locale="ko" dateFormat="yy-mm-dd (D)"
                value={rpDateS}
                onChange={(e) => set_rpDateS(e.target.value)}
              />
              <span>~</span>
              <PrimeCalendar id="rpDateE"
                className="flex-grow-1"
                locale="ko" dateFormat="yy-mm-dd (D)"
                value={rpDateE}
                onChange={(e) => set_rpDateE(e.target.value)}
              />
            </div>
          </div>

          <div className="inputWrap">
            <label htmlFor="rpPeriod" className="required">반복 주기</label>
            <SelectButton id="rpPeriod"
              className={classNames('w-full', { 'p-invalid': submitted && !rpPeriod })}
              options={periodOptions}
              optionLabel="cdLabel"
              optionValue="cd"
              value={rpPeriod}
              onChange={(e) => {
                set_rpPeriod(e.value);
                // 주기가 변경되면 반복일 초기화 (센스있게 1일 또는 월요일로)
                if (e.value === 'M') set_rpDay('1');
                else if (e.value === 'W') set_rpDay('월');
              }}
            />
            <Dropdown id="rpDay"
              className={classNames('ml-3 w-5', { 'p-invalid': submitted && (rpDay === null || rpDay === '') })}
              options={rpPeriod === 'W' ? weekDays : monthDays}
              value={rpDay}
              onChange={(e) => set_rpDay(e.value)}
              placeholder={rpPeriod === 'W' ? "요일 선택" : "날짜 선택"}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpCategory" className="required">분류</label>
            <Dropdown id="rpCategory"
              className={classNames('w-full', { 'p-invalid': submitted && !rpCategory })}
              placeholder="분류 선택"
              options={categoryOptions.find(node => node.key === rpType)?.children || []}
              optionLabel="cdLabel"
              optionValue="cd"
              value={rpCategory}
              onChange={(e) => {
                set_rpCategory(e.value);
                const selectedCategory = categoryOptions.find(node => node.key === rpType)?.children.find(c => c.cd === e.value);
                if (selectedCategory?.cdDefaultAcc1) {
                  set_rpAcc1(selectedCategory.cdDefaultAcc1);
                }
              }}
              itemTemplate={categoryItemTemplate}
              valueTemplate={categoryValueTemplate}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpMemo">내용</label>
            <InputText id="rpMemo"
              value={rpMemo}
              onChange={(e) => set_rpMemo(e.target.value)}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpAcc1" className="required">{rpAcc1Label}</label>
            <Dropdown id="rpAcc1"
              className={classNames('w-full', { 'p-invalid': submitted && !rpAcc1 })}
              placeholder="자산 선택"
              options={assetNodes}
              optionLabel="accLabel"
              optionValue="accCode"
              optionGroupLabel="accType"
              optionGroupChildren="children"
              value={rpAcc1}
              onChange={(e) => set_rpAcc1(e.value)}
              itemTemplate={assetItemTemplate}
              valueTemplate={assetValueTemplate}
            />
          </div>

          <div className={`inputWrap ${rpType !== '이체' ? 'hidden' : ''}`}>
            <label htmlFor="rpAcc2" className="required">{rpAcc2Label}</label>
            <Dropdown id="rpAcc2"
              className={classNames('w-full', { 'p-invalid': submitted && rpType === '이체' && !rpAcc2 })}
              placeholder="자산 선택"
              options={assetNodes}
              optionLabel="accLabel"
              optionValue="accCode"
              optionGroupLabel="accType"
              optionGroupChildren="children"
              value={rpAcc2}
              onChange={(e) => set_rpAcc2(e.value)}
              itemTemplate={assetItemTemplate}
              valueTemplate={assetValueTemplate}
            />
          </div>

          <div className="inputWrap">
            <label htmlFor="rpAmount" className="required">회당 금액</label>
            <InputNumber id="rpAmount"
              className={classNames({ 'p-invalid': submitted && (rpAmount === 0 || rpAmount === null) })}
              mode="currency" currency="KRW" locale="ko-KR"
              value={rpAmount}
              onValueChange={(e) => set_rpAmount(e.target.value)}
            />
          </div>
          <div className="inputWrap">
            <label htmlFor="rpTotalAmount">총 금액</label>
            <div className="flex align-items-center gap-2 w-full">
              <InputNumber id="rpTotalAmount"
                className="flex-grow-1"
                mode="currency" currency="KRW" locale="ko-KR"
                placeholder="전체 계약 금액 또는 목표 금액"
                value={rpTotalAmount}
                onValueChange={(e) => set_rpTotalAmount(e.target.value)}
              />
              <Button severity="info" outlined
                icon="pi pi-calculator" label="계산"
                tooltip="기간/주기 기반 자동 계산"
                tooltipOptions={{ position: 'left' }}
                onClick={calculateTotalAmount}
              />
            </div>
          </div>
        </div>
      </Panel>
      <ConfirmDialog />
    </Sidebar>
  );
}
