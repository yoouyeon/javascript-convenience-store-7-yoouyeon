// @ts-check
import Promotion from './Promotion.js';

/** @typedef {import('./Promotion.js').default} PromotionType */

class PromotionManager {
  /** @type {Map<string, PromotionType>} */
  #promotionMap;

  /**
   * @constructor
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
}

export default PromotionManager;
