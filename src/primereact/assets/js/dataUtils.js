import dayjs from 'dayjs';
import { REPEAT_PERIOD, TRANSACTION_TYPE } from '@/assets/js/constants';

/**
 * 콤마(,) 등 숫자 외의 문자가 포함된 문자열을 숫자로 파싱합니다.
 * @param {string|number} val
 * @returns {number}
 */
export const parseAmount = (val) => {
  if (val === undefined || val === null) return 0;
  return (
    Number(
      String(val)
        .replace(/,/g, '')
        .replace(/[^0-9.-]+/g, ''),
    ) || 0
  );
};

/**
 * 반복 설정 객체를 기반으로 반복 실행될 대상 날짜 배열을 계산합니다.
 * @param {Object} repeat - 반복 설정 객체 (rpDateS, rpDateE, rpPeriod, rpDay 포함)
 * @returns {dayjs[]} - 계산된 target 날짜(dayjs 객체) 배열
 */
export const calculateRepeatDates = (repeat) => {
  const { rpDateS, rpDateE, rpPeriod, rpDay } = repeat;
  if (!rpDateS || !rpDateE || !rpPeriod || !rpDay) return [];

  const start = dayjs(rpDateS);
  const end = dayjs(rpDateE);
  const targetDates = [];

  if (rpPeriod === REPEAT_PERIOD.MONTHLY) {
    const day = parseInt(rpDay, 10);
    let temp = start.date(day);
    // 시작일(rpDateS)보다 계산된 날짜가 과거면 다음 달부터
    if (temp.isBefore(start, 'day')) temp = temp.add(1, 'month');

    while (temp.isBefore(end) || temp.isSame(end, 'day')) {
      targetDates.push(temp);
      temp = temp.add(1, 'month');
    }
  } else if (rpPeriod === REPEAT_PERIOD.WEEKLY) {
    const dayOfWeekMap = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
    const dayOfWeek = dayOfWeekMap[rpDay];

    let temp = start.day(dayOfWeek);
    // 시작일(rpDateS)보다 계산된 요일 날짜가 과거면 다음 주부터
    if (temp.isBefore(start, 'day')) temp = temp.add(1, 'week');

    while (temp.isBefore(end) || temp.isSame(end, 'day')) {
      targetDates.push(temp);
      temp = temp.add(1, 'week');
    }
  }

  return targetDates;
};

/**
 * 가계부 내역 합계를 계산합니다.
 * @param {Array} data - 필터링된 데이터 배열
 * @param {Object} categoryMap - 카테고리 정보 맵 (합계 제외 여부 확인용)
 * @returns {Object} 합계 객체
 */
export const calculateLedgerTotal = (data, categoryMap) => {
  const total = {
    income0: 0,
    expense0: 0,
    transfer0: 0,
    income1: 0,
    expense1: 0,
    transfer1: 0,
    incomeA: 0,
    expenseA: 0,
    transferA: 0,
  };

  data.forEach((item) => {
    const catInfo = categoryMap[item.gCategory];
    if (catInfo && catInfo.cdAddSum === false) return;

    const amount = Number(item.gAmount) || 0;
    if (!item.gExecuted) {
      if (item.gType === TRANSACTION_TYPE.INCOME) total.income0 += amount;
      else if (item.gType === TRANSACTION_TYPE.EXPENSE)
        total.expense0 += amount;
      else if (item.gType === TRANSACTION_TYPE.TRANSFER)
        total.transfer0 += amount;
    } else {
      if (item.gType === TRANSACTION_TYPE.INCOME) total.income1 += amount;
      else if (item.gType === TRANSACTION_TYPE.EXPENSE)
        total.expense1 += amount;
      else if (item.gType === TRANSACTION_TYPE.TRANSFER)
        total.transfer1 += amount;
    }
  });

  total.incomeA = total.income0 + total.income1;
  total.expenseA = total.expense0 + total.expense1;
  total.transferA = total.transfer0 + total.transfer1;

  return total;
};

/**
 * 자산 내역(이체) 합계를 계산합니다.
 * @param {Array} data - 필터링된 데이터 배열
 * @param {string} accCode - 기준 자산 코드
 * @returns {Object} 합계 객체
 */
export const calculateAssetTotal = (data, accCode) => {
  const total = {
    deposit0: 0,
    withdraw0: 0,
    revenue0: 0,
    deposit1: 0,
    withdraw1: 0,
    revenue1: 0,
    depositA: 0,
    withdrawA: 0,
    revenueA: 0,
  };

  data.forEach((item) => {
    const amount = Number(item.gAmount) || 0;

    if (!item.gExecuted) {
      if (amount >= 0) {
        if (item.gAcc1 === item.gAcc2) total.revenue0 += amount;
        else if (item.gAcc2 === accCode) total.deposit0 += amount;
        else if (item.gAcc1 === accCode) total.withdraw0 += -amount;
      } else {
        if (item.gAcc1 === item.gAcc2) total.revenue0 += amount;
        else if (item.gAcc1 === accCode) total.deposit0 += -amount;
        else if (item.gAcc2 === accCode) total.withdraw0 += amount;
      }
    } else {
      if (amount >= 0) {
        if (item.gAcc1 === item.gAcc2) total.revenue1 += amount;
        else if (item.gAcc2 === accCode) total.deposit1 += amount;
        else if (item.gAcc1 === accCode) total.withdraw1 += -amount;
      } else {
        if (item.gAcc1 === item.gAcc2) total.revenue1 += amount;
        else if (item.gAcc1 === accCode) total.deposit1 += -amount;
        else if (item.gAcc2 === accCode) total.withdraw1 += amount;
      }
    }
  });

  total.depositA = total.deposit0 + total.deposit1;
  total.withdrawA = total.withdraw0 + total.withdraw1;
  total.revenueA = total.revenue0 + total.revenue1;

  return total;
};
