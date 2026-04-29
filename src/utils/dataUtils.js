import dayjs from 'dayjs';
import { REPEAT_PERIOD } from '@/assets/js/constants';

/**
 * 콤마(,) 등 숫자 외의 문자가 포함된 문자열을 숫자로 파싱합니다.
 * @param {string|number} val 
 * @returns {number}
 */
export const parseAmount = (val) => {
  if (val === undefined || val === null) return 0;
  return Number(String(val).replace(/,/g, '').replace(/[^0-9.-]+/g, '')) || 0;
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
    const dayOfWeekMap = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
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
