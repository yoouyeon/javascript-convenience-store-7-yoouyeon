// @ts-check

class PromotionManager {
  /** @type {import('../types.js').PromotionType} */
  #promotionMap;

  /**
   * @constructor
   * @param {import('../types.js').PromotionRawDataType} promotionsRawData
   */
  constructor(promotionsRawData) {
    this.#promotionMap = new Map();
    this.#initPromotionMap(promotionsRawData);
  }

  get currentPromotions() {
    return this.#promotionMap;
  }

  /**
   * @param {import('../types.js').PromotionRawDataType} promotionsRawData - 파일에서 읽어온 프로모션 데이터
   */
  #initPromotionMap(promotionsRawData) {
    promotionsRawData.forEach((promotion) => {
      const { name, ...rest } = promotion;
      const promotionInfo = PromotionManager.#convertRawDataToPromotionInfo(rest);
      this.#promotionMap.set(name, promotionInfo);
    });
  }

  /**
   * Raw 데이터 형식을 프로모션 정보 형식으로 변환합니다.
   * @param {Omit<import('../types.js').SinglePromotionRawDataType, 'name'>} promotionInfo - 구매 수량, 증정 수량, 시작일, 종료일
   * @returns {import('../types.js').PromotionInfoType} - 프로모션 정보
   */
  static #convertRawDataToPromotionInfo(promotionInfo) {
    // promotions.md의 header 형식을 그대로 유지하기 위해서 camelcase를 사용하지 않음
    // eslint-disable-next-line camelcase
    const { buy, get, start_date, end_date } = promotionInfo;
    // TODO : 유효성 검사를 여기서 해야 할듯?
    return {
      buy: Number(buy),
      get: Number(get),
      startDate: new Date(start_date),
      endDate: new Date(end_date),
    };
  }
}

export default PromotionManager;
