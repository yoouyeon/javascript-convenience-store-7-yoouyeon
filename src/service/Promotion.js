// @ts-check
import dateUtils from '../utils/dateUtils.js';
import validateUtils from '../utils/validateUtils.js';
import CustomError from '../utils/CustomError.js';

class Promotion {
  #name;

  #quantity;

  #date;

  /**
   * @constructor
   * @param {import('../types.js').SinglePromotionRawDataType} singlePromotionRawData - 파일에서 읽어온 프로모션 데이터
   */
  constructor(singlePromotionRawData) {
    Promotion.#validateData(singlePromotionRawData);
    // promotions.md의 header 형식을 그대로 유지하기 위해서 camelcase를 사용하지 않음
    // eslint-disable-next-line camelcase
    const { name, buy, get, start_date, end_date } = singlePromotionRawData;
    this.#name = name;
    this.#quantity = { buy: Number(buy), get: Number(get) };
    this.#date = {
      startDate: new Date(start_date),
      endDate: new Date(end_date),
    };
  }

  get quantity() {
    return this.#quantity;
  }

  get name() {
    return this.#name;
  }

  /**
   * 오늘 날짜가 프로모션 기간에 포함되는지 확인합니다.
   * @returns {boolean} 프로모션 적용 가능 여부
   */
  isAvailable() {
    const today = dateUtils.today();
    const { startDate, endDate } = this.#date;
    return dateUtils.isBetween(today, startDate, endDate);
  }

  /**
   * 구매 수량을 받아서 최대 프로모션 적용 수량을 계산합니다.
   * @param {number} count - 구매 수량
   * @param {number} promoStock - 프로모션 재고
   * @return {import('../types.js').PromotionQuantityType} - 프로모션 적용 수량 정보
   */
  getFullQuantity(count, promoStock) {
    const { buy, get } = this.#quantity;
    const { promo, free } = Promotion.#calCount(count, promoStock, buy, get);
    const nonPromo = Promotion.#calNonPromoCount(count, promo, free);
    return { promo, free, nonPromo, total: promo + free + nonPromo };
  }

  /**
   * 구매 수량을 받아서 프로모션을 적용한 결과를 반환합니다.
   * @param {number} promoCount - 프로모션을 적용할 수량
   * @param {number} promoStock - 프로모션 재고
   * @param {number=} nonPromoCount - 프로모션을 적용하지 않을 수량
   * @return {import('../types.js').PromotionQuantityType} - 프로모션 적용 수량 정보
   */
  getCount(promoCount, promoStock, nonPromoCount) {
    const { buy, get } = this.#quantity;
    const calResult = Promotion.#calFitCount(promoCount, promoStock, buy, get);
    const nonPromo = Promotion.#calNonPromoCount(promoCount, calResult.promo, calResult.free);
    return {
      ...calResult,
      nonPromo: nonPromo + (nonPromoCount || 0),
      total: calResult.promo + calResult.free + nonPromo + (nonPromoCount || 0),
    };
  }

  static #calCount(count, promoStock, buy, get) {
    let [promo, free, currCount, currStock] = [0, 0, count, promoStock];
    while (currCount >= buy && currStock - (buy + get) >= 0) {
      promo += buy;
      free += get;
      currCount -= buy;
      currStock -= buy + get;
    }
    return { promo, free };
  }

  // promo와 free의 합이 count를 넘으면 안된다.
  static #calFitCount(count, promoStock, buy, get) {
    let [promo, free, currCount, currStock] = [0, 0, count, promoStock];
    while (currCount >= buy && currStock - (buy + get) >= 0 && promo + free <= count - buy - get) {
      promo += buy;
      free += get;
      currCount -= buy;
      currStock -= buy + get;
    }
    return { promo, free };
  }

  static #calNonPromoCount(count, promo, free) {
    if (count - promo - free > 0) {
      return count - promo - free;
    }
    return 0;
  }

  /**
   * 프로모션 정보가 유효한지 검사합니다.
   *@param {import('../types.js').SinglePromotionRawDataType} singlePromotionRawData - 파일에서 읽어온 프로모션 데이터
   */
  static #validateData(singlePromotionRawData) {
    const { isValidString, isValidNumber, isValidDate } = validateUtils;
    // promotions.md의 header 형식을 그대로 유지하기 위해서 camelcase를 사용하지 않음
    // eslint-disable-next-line camelcase
    const { name, buy, get, start_date, end_date } = singlePromotionRawData;
    if (!isValidString(name)) throw new CustomError('프로모션 이름이 올바르지 않습니다.');
    if (!isValidNumber(buy) || !isValidNumber(get))
      throw new CustomError('프로모션 수량이 숫자가 아닙니다.');
    if (!isValidDate(start_date) || !isValidDate(end_date))
      throw new CustomError('프로모션 데이터의 날짜 형식이 올바르지 않습니다.');
  }
}

export default Promotion;
