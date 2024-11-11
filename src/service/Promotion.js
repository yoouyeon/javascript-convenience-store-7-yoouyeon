// @ts-check
import dateUtils from '../utils/dateUtils.js';

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
    this.#date = {
      startDate: new Date(start_date),
      endDate: new Date(end_date),
    };
  }

  get quantity() {
    return this.#quantity;
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
    let nonPromo = 0;
    if (count - promo - free > 0) {
      nonPromo = count - promo - free;
    }
    return { promo, free, nonPromo, total: promo + free + nonPromo };
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

  // /**
  //  * 구매 수량을 받아서 프로모션을 적용한 결과를 반환합니다.
  //  * @param {number} promoQuantity - 프로모션을 적용할 수량
  //  * @param {number=} nonPromoQuantity - 프로모션을 적용하지 않을 수량
  //  * @return {import('../types.js').PromotionQuantityType} - 프로모션 적용 수량 정보
  //  * @example
  //  * // 프로모션 정보가 { buy: 3, get: 1 }이고, 구매 수량이 3일 때
  //  * const quantity = promotion.getQuantity(3);
  //  * console.log(quantity); // { buy: 0, get: 0, nonPromo: 3, total: 3 }
  //  */
  // getQuantity(promoQuantity, nonPromoQuantity) {
  //   const { promo, free, nonPromo, total } =
  //     this.#getFittedQuantity(promoQuantity);
  //   return {
  //     promo,
  //     free,
  //     nonPromo: nonPromo + (nonPromoQuantity || 0),
  //     total: total + (nonPromoQuantity || 0),
  //   };
  // }

  // /**
  //  * 프로모션을 fit하게 적용할 수 있는 최대 promo 수량을 반환합니다.
  //  * @param {number} promoQuantity - 프로모션을 적용할 수량
  //  * @return {import('../types.js').PromotionQuantityType} - 프로모션 적용 수량 정보
  //  */
  // #getFittedQuantity(promoQuantity) {
  //   const { buy: promoBuy, get: promoGet } = this.#quantity;
  //   let { promo, free, nonPromo } = { ...this.getFullQuantity(promoQuantity) };
  //   while (promo + free + nonPromo > promoQuantity) {
  //     promo -= promoBuy;
  //     free -= promoGet;
  //     nonPromo += promoBuy;
  //   }
  //   return { promo, free, nonPromo, total: promo + free + nonPromo };
  // }
}

export default Promotion;
