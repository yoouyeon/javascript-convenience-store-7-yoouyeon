import validateUtils from '../utils/validateUtils.js';
import CustomError from '../utils/CustomError.js';

class ProductStock {
  /** @type {import('../types.js').ProductStockInfoType} */
  #normal;

  /** @type {import('../types.js').ProductStockInfoType} */
  #promotion;

  /**
   * @constructor
   * @param {import('../types.js').SingleProductRawDataType} stockData - 상품명, 가격, 수량, 프로모션 정보
   */
  constructor(stockData) {
    this.setStockInfo(stockData);
  }

  get promoName() {
    return this.#promotion?.promotion || '';
  }

  get price() {
    return this.#normal?.price || this.#promotion?.price || 0;
  }

  get totalQuantity() {
    return (this.#normal?.quantity || 0) + (this.#promotion?.quantity || 0);
  }

  get promotionQuantity() {
    return this.#promotion?.quantity || 0;
  }

  get normalQuantity() {
    return this.#normal?.quantity || 0;
  }

  /**
   * 상품 재고 정보를 설정합니다. (일반 재고와 프로모션 재고를 구분하여 설정)
   * @param {import('../types.js').SingleProductRawDataType} stockData - 상품명, 가격, 수량, 프로모션 정보
   */
  setStockInfo(stockData) {
    ProductStock.#validateData(stockData);
    const { price, quantity, promotion } = stockData;
    if (!promotion || promotion === 'null')
      this.#normal = { price: Number(price), quantity: Number(quantity) };
    else {
      this.#promotion = { price: Number(price), quantity: Number(quantity), promotion };
      // 프로모션 정보만 있는 상품은 일반 재고 정보를 추가해야 한다.
      if (!this.#normal) this.#normal = { price: Number(price), quantity: 0 };
    }
  }

  /**
   * 상품 재고를 차감합니다.
   * @param {number} requestedAmount - 차감할 상품 재고 양
   * @param {boolean} isPromotion - 프로모션 상품인지 여부
   */
  decreaseStock(requestedAmount, isPromotion) {
    let targetStock = this.#normal;
    if (isPromotion) targetStock = this.#promotion;
    const { primary, extra } = ProductStock.#calcStock(targetStock, requestedAmount);
    this.#reduceQuantity(primary, extra, isPromotion);
  }

  /**
   * 현재 주로 사용할 재고에서 차감할 수 있는 양과 다른 재고로 넘겨서 차감할 양을 계산합니다.
   * @param {import('../types.js').ProductStockInfoType} targetStock - 주로 사용할 재고 정보
   * @param {number} requestedAmount - 차감할 상품 재고 양
   * @returns {{ primary: number, extra: number }} - 주로 사용할 재고에서 차감할 수 있는 양과 다른 재고로 넘겨서 차감할 양
   */
  static #calcStock(targetStock, requestedAmount) {
    const currentQty = targetStock?.quantity || 0;
    const primary = Math.min(currentQty, requestedAmount);
    const extra = Math.max(0, requestedAmount - primary);
    return { primary, extra };
  }

  /**
   * 상품 재고 수량을 차감합니다.
   * @param {number} primary - 주로 사용할 재고에서 차감할 수 있는 양
   * @param {number} extra - 다른 재고로 넘겨서 차감할 양
   * @param {boolean} isPromotion - 프로모션 상품인지 여부
   */
  #reduceQuantity(primary, extra, isPromotion) {
    if (isPromotion) {
      this.#promotion.quantity -= primary;
      this.#normal.quantity -= extra;
      return;
    }
    this.#normal.quantity -= primary;
    this.#promotion.quantity -= extra;
  }

  /**
   * 상품 재고 데이터의 유효성을 확인합니다.
   * @param {import('../types.js').SingleProductRawDataType} stockData - 상품명, 가격, 수량, 프로모션 정보
   */
  static #validateData(stockData) {
    const { isValidNumber, isValidString } = validateUtils;
    const { price, quantity, promotion } = stockData;
    if (!isValidNumber(price) || !isValidNumber(quantity))
      throw new CustomError('가격과 수량 정보가 숫자가 아닙니다.');
    if (!isValidString(promotion)) throw new CustomError('프로모션 이름이 유효하지 않습니다.');
  }
}

export default ProductStock;
