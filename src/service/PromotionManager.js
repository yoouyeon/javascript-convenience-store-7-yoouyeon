// @ts-check
import CustomError from '../utils/CustomError.js';
import Promotion from './Promotion.js';
import InputView from '../view/InputView.js';
import retryAsync from '../utils/retryAsync.js';
import PROMOTION_ERROR_MESSAGES from '../constants/promotionErrorMessages.js';

/** @typedef {import('./Promotion.js').default} PromotionType */

class PromotionManager {
  /** @type {Map<string, PromotionType>} */
  #promotionMap;

  /**
   * @param {import('../types.js').PromotionRawDataType} promotionsRawData
   */
  constructor(promotionsRawData) {
    this.#promotionMap = new Map();
    promotionsRawData.forEach((promotionRawData) => {
      const promotion = new Promotion(promotionRawData);
      this.#promotionMap.set(promotionRawData.name, promotion);
    });
  }

  get currentPromotions() {
    return this.#promotionMap;
  }

  /**
   * 프로모션을 적용한다.
   * @param {{productName: string, count: number, promoStock: import('../types.js').ProductStockInfoType | undefined}} req - 프로모션 적용 요청 정보
   * @return {Promise<import('../types.js').PromotionQuantityType>} - 프로모션 적용 수량 정보
   */
  async applyPromotion(req) {
    const { promotion } = this.#checkPromotionAvailability(req.promoStock?.promotion);
    if (!promotion) return { promo: 0, free: 0, nonPromo: req.count, total: req.count };
    const fullCount = promotion.getFullQuantity(req.count, req.promoStock?.quantity || 0);
    const requestParams = { ...req, fullCount, promotion };
    const exceed = await PromotionManager.#processBuyExceed(requestParams);
    if (exceed) return exceed;
    const additionalResult = await PromotionManager.#processBuyMore(requestParams);
    return additionalResult;
  }

  getPromoAvailability(promoName) {
    return this.#checkPromotionAvailability(promoName).promotion?.isAvailable() || false;
  }

  /**
   * 프로모션 정보를 반환
   * @param {string=} promotionName
   * @returns {PromotionType | undefined} - 프로모션 정보
   */
  #getPromotion(promotionName) {
    if (!promotionName || promotionName === 'null') return undefined;
    const promotion = this.#promotionMap.get(promotionName);
    if (!promotion) {
      throw new CustomError(PROMOTION_ERROR_MESSAGES.notExist);
    }
    return promotion;
  }

  /**
   * 프로모션이 있는지 확인하고, 적용 가능한지 확인한다.
   * @param {string | undefined} promoName - 프로모션명
   *
   */
  #checkPromotionAvailability(promoName) {
    if (!promoName) {
      return { promotion: undefined };
    }
    const promotion = this.#getPromotion(promoName);
    if (!promotion || !promotion.isAvailable()) {
      return { promotion: undefined };
    }
    return { promotion };
  }

  /**
   * 추가 구매가 필요한지 확인하고 처리한다.
   * @param {{productName: string, count: number, promoStock: import('../types.js').ProductStockInfoType | undefined, fullCount: import('../types.js').PromotionQuantityType, promotion: PromotionType}} req - 프로모션 적용 요청 정보
   */
  static async #processBuyExceed(req) {
    const { productName, count, fullCount, promoStock, promotion } = req;
    const exceed = fullCount.nonPromo;
    if (!PromotionManager.#checkExceed(promotion, count, fullCount, exceed)) return undefined;
    const buyExceed = await retryAsync(() =>
      InputView.readExceedConfirm.bind(InputView)(productName, exceed)
    );
    if (buyExceed) return promotion.getCount(count - exceed, promoStock?.quantity || 0, exceed);
    return promotion.getCount(count - exceed, promoStock?.quantity || 0, 0);
  }

  static #checkExceed(promotion, count, fullCount, exceed) {
    if (fullCount.total !== count || exceed === 0) return false;
    const { buy } = promotion.quantity;
    if (count < buy) return false;
    return true;
  }

  /**
   * 추가 구매 여부를 묻고 처리한다.
   * @param {{productName: string, count: number, promoStock: import('../types.js').ProductStockInfoType | undefined, fullCount: import('../types.js').PromotionQuantityType, promotion: PromotionType}} req - 프로모션 적용 요청 정보
   */
  static async #processBuyMore(req) {
    const { productName, count, fullCount, promotion, promoStock } = req;
    if (fullCount.total > count) {
      const buyMore = await retryAsync(() =>
        InputView.readPromoConfirm.bind(InputView)(productName, fullCount.free)
      );
      if (buyMore) return promotion.getCount(fullCount.total, promoStock?.quantity || 0);
    }
    return promotion.getCount(count, promoStock?.quantity || 0);
  }
}

export default PromotionManager;
