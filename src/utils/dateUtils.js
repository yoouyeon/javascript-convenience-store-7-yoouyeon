import { DateTimes } from '@woowacourse/mission-utils';

const dateUtils = Object.freeze({
  /**
   * 오늘 날짜를 Date 객체로 반환합니다.
   * @returns {Date} 오늘 날짜
   */
  today() {
    return DateTimes.now();
  },

  /**
   * 주어진 날짜가 기간 내에 포함되는지 확인합니다.
   * @param {Date} targetDate - 대상 날짜
   * @param {Date} startDate - 시작 날짜
   * @param {Date} endDate - 종료 날짜
   */
  isBetween(targetDate, startDate, endDate) {
    targetDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return targetDate >= startDate && targetDate <= endDate;
  },
});

export default dateUtils;
