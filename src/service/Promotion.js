// @ts-check
import dateUtils from '../utils/dateUtils';

class Promotion {
  #name;

  #quantity;

  #date;

  /**
   * @constructor
   * @param {import('../types.js').SinglePromotionRawDataType} singlePromotionRawData - 파일에서 읽어온 프로모션 데이터
   */
  constructor(singlePromotionRawData) {
    // promotions.md의 header 형식을 그대로 유지하기 위해서 camelcase를 사용하지 않음
    // eslint-disable-next-line camelcase
    const { name, buy, get, start_date, end_date } = singlePromotionRawData;
    // TODO : 유효성 검사를 여기서 해야 할듯?
    this.#name = name;
    this.#quantity = { buy: Number(buy), get: Number(get) };
    this.#date = { startDate: new Date(start_date), endDate: new Date(end_date) };
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
   * @param {number} quantity - 구매 수량
   * @return {import('../types.js').PromotionQuantityType} - 프로모션 적용 수량 정보
   * @example
   * // 프로모션 정보가 { buy: 3, get: 1 }이고, 구매 수량이 5일 때
   * const fullQuantity = promotion.getFullQuantity(5);
   * console.log(fullQuantity); // { buy: 3, get: 1, nonPromo: 1, total: 5 }
   * @example
   * // 프로모션 정보가 { buy: 3, get: 1 }이고, 구매 수량이 3일 때
   * const fullQuantity = promotion.getFullQuantity(3);
   * console.log(fullQuantity); // { buy: 3, get: 1, nonPromo: 0, total: 4 }
   */
  getFullQuantity(quantity) {
    const { buy: buyQuantity, get: getQuantity } = this.#quantity;
    const buy = Math.floor(quantity / buyQuantity) * buyQuantity;
    const get = Math.floor(buy / buyQuantity) * getQuantity;
    let nonPromo = 0;
    if (quantity > buy + get) nonPromo = quantity - (buy + get);
    return { buy, get, nonPromo, total: buy + get + nonPromo };
  }

  /**
   * 구매 수량을 받아서 프로모션을 적용한 결과를 반환합니다.
   * @param {number} quantity - 구매 수량
   * @return {import('../types.js').PromotionQuantityType} - 프로모션 적용 수량 정보
   * @example
   * // 프로모션 정보가 { buy: 3, get: 1 }이고, 구매 수량이 3일 때
   * const quantity = promotion.getQuantity(3);
   * console.log(quantity); // { buy: 0, get: 0, nonPromo: 3, total: 3 }
   */
  getQuantity(quantity) {
    const { buy: promoBuy, get: promoGet } = this.#quantity;
    let { buy, get, nonPromo } = { ...this.getFullQuantity(quantity) };
    while (buy + get + nonPromo > quantity) {
      buy -= promoBuy;
      get -= promoGet;
      nonPromo += promoBuy;
    }
    return { buy, get, nonPromo, total: buy + get + nonPromo };
  }
}

export default Promotion;
