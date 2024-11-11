// @ts-check
import CustomError from '../utils/CustomError.js';

class InventoryManager {
  // ========================
  // 1. Member Variables
  // ========================
  /** @type {import('../types.js').ProductStockType} */
  #inventoryMap;
  // TODO : 합칠 수 있는 메서드 정리하기
  // TODO : 네이밍 다시 확인하기 (통일되지 않은 부분이 있을 수 있음)

  // ========================
  // 2. Constructor
  // ========================
  /**
   * @param {import('../types.js').ProductRawDataType} productsRawData - 파일에서 읽어온 재고 데이터
   */
  constructor(productsRawData) {
    this.#inventoryMap = new Map();
    this.#initInventoryMap(productsRawData);
  }

  // ========================
  // 3. Getters
  // ========================
  get currentInventory() {
    return this.#inventoryMap;
  }

  getPromoName(productName) {
    const productStock = this.#inventoryMap.get(productName);
    return productStock?.promotion?.promotion;
  }

  getPrice(productName) {
    const productStock = this.#inventoryMap.get(productName);
    return productStock?.normal?.price || productStock?.promotion?.price || 0;
  }

  // ========================
  // 4. Public Methods
  // ========================
  /**
   * 구매 요청에 대해서 가능 여부를 확인하고 재고 정보를 반환합니다.
   * @param {string} productName - 구매할 상품명
   * @param {number} quantity - 구매할 수량
   * @returns {import('../types.js').SingleProductStockType} - 구매 가능 여부와 해당 상품 재고 정보
   * @throw {import ('../utils/CustomError.js').default } - 재고가 없는 경우 에러를 발생시킵니다.
   */
  checkInventory(productName, quantity) {
    const productStock = this.#inventoryMap.get(productName);
    if (!productStock)
      throw new CustomError(`"${productName}"은 존재하지 않는 상품입니다. 다시 입력해주세요.`);
    const { normal, promotion } = productStock;
    const totalQuantity = (normal?.quantity || 0) + (promotion?.quantity || 0);
    if (totalQuantity < quantity)
      throw new CustomError(`"${productName}"의 재고가 부족합니다. 다시 입력해주세요.`);
    return productStock;
  }

  /**
   * 상품 재고를 차감합니다.
   * @param {string} productName - 상품명
   * @param {number} quantity - 차감할 상품 재고 양
   * @param {boolean} isPromotion - 프로모션 상품인지 여부
   */
  decreaseStock(productName, quantity, isPromotion) {
    const productStock = this.#inventoryMap.get(productName);
    if (!productStock) return;
    const newStock = InventoryManager.#generateNewStock(productStock, quantity, isPromotion);
    this.#updateStock(productName, newStock);
  }

  // ========================
  // 5. Private Methods
  // ========================
  /**
   * @param {import('../types.js').ProductRawDataType} parsedProductData - 상품명, 가격, 수량, 프로모션 정보
   */
  #initInventoryMap(parsedProductData) {
    parsedProductData.forEach((product) => {
      const { name, ...rest } = product;
      const productInfo = InventoryManager.#convertRawDataToStockInfo(rest);
      const stockInfo = InventoryManager.#makeStockInfo(productInfo);
      this.#setNewStock(name, stockInfo);
    });
  }

  /**
   * Raw 데이터 형식을 재고 정보 형식으로 변환합니다.
   * @param {Omit<import('../types.js').SingleProductRawDataType, 'name'>} productInfo - 가격, 수량, 프로모션 정보
   * @returns {import('../types.js').ProductStockInfoType} - 재고 정보
   */
  static #convertRawDataToStockInfo(productInfo) {
    const { price, quantity, promotion } = productInfo;
    // TODO : 유효성 검사를 여기서 해야 할듯?
    return { price: Number(price), quantity: Number(quantity), promotion };
  }

  /**
   * @param {Partial<import('../types.js').ProductStockInfoType>} productInfo - 가격, 수량, 프로모션 정보
   * @returns {import('../types.js').SingleProductStockType}
   */
  static #makeStockInfo(productInfo) {
    const { price, quantity, promotion } = productInfo;
    if (!price) return {};
    if (!promotion || promotion === 'null') {
      return { normal: { price: Number(price), quantity: Number(quantity) } };
    }
    return { promotion: { price: Number(price), quantity: Number(quantity), promotion } };
  }

  /**
   * @param {string} productName
   * @param {import('../types.js').SingleProductStockType} productStock
   */
  #setNewStock(productName, productStock) {
    if (this.#inventoryMap.has(productName))
      this.#inventoryMap.set(productName, {
        ...this.#inventoryMap.get(productName),
        ...productStock,
      });
    else this.#inventoryMap.set(productName, { ...productStock });
  }

  /**
   * 새로운 재고 정보를 생성합니다.
   * @param {import('../types.js').SingleProductStockType} productStock - 상품 재고 정보
   * @param {number} quantity - 차감할 상품 재고 양
   * @param {boolean} isPromotion - 프로모션 중인지 여부
   */
  static #generateNewStock(productStock, quantity, isPromotion) {
    if (isPromotion) return InventoryManager.#generatePromoDescStock(productStock, quantity);
    return InventoryManager.#generateNormalDescStock(productStock, quantity);
  }

  /**
   * @param {import('../types.js').SingleProductStockType} productStock - 상품 재고 정보
   * @param {number} quantity - 차감할 상품 재고 양
   */
  static #generatePromoDescStock(productStock, quantity) {
    const { normal, promotion } = productStock;
    const { promoDesc, normalDesc } = InventoryManager.#calPromoDesc(promotion?.quantity, quantity);
    return {
      normal: InventoryManager.#decreaseStockQuantity(normal, normalDesc),
      promotion: InventoryManager.#decreaseStockQuantity(promotion, promoDesc),
    };
  }

  /**
   * @param {import('../types.js').SingleProductStockType} productStock - 상품 재고 정보
   * @param {number} quantity - 차감할 상품 재고 양
   */
  static #generateNormalDescStock(productStock, quantity) {
    const { normal, promotion } = productStock;
    const { normalDesc, promoDesc } = InventoryManager.#calNormalDesc(normal?.quantity, quantity);
    return {
      normal: InventoryManager.#decreaseStockQuantity(normal, normalDesc),
      promotion: InventoryManager.#decreaseStockQuantity(promotion, promoDesc),
    };
  }

  /**
   * 감소시킬 재고 정보를 계산합니다. (프로모션 중일 때)
   * @param {number | undefined} promoCount - 프로모션 재고 수량
   * @param {number} quantity - 차감할 상품 재고 양
   */
  static #calPromoDesc(promoCount, quantity) {
    return {
      promoDesc: Math.min(promoCount || 0, quantity),
      normalDesc: Math.max(0, quantity - Math.min(promoCount || 0, quantity)),
    };
  }

  /**
   * 개수를 줄인 재고 정보를 반환합니다. (프로모션 중이 아닐 때)
   * @param {number | undefined} normalCount - 일반 재고 수량
   * @param {number} quantity - 차감할 상품 재고 양
   */
  static #calNormalDesc(normalCount, quantity) {
    return {
      normalDesc: Math.min(normalCount || 0, quantity),
      promoDesc: Math.max(0, quantity - Math.min(normalCount || 0, quantity)),
    };
  }

  /**
   * 개수를 줄인 재고 정보를 반환합니다.
   * @param {import('../types.js').ProductStockInfoType | undefined} stockInfo - 개수를 줄일 재고 정보
   * @param {number} quantity - 줄일 개수
   * @returns {import('../types.js').ProductStockInfoType | undefined} - 개수를 줄인 재고 정보
   */
  static #decreaseStockQuantity(stockInfo, quantity) {
    if (!stockInfo) return undefined;
    return {
      ...stockInfo,
      quantity: stockInfo.quantity - quantity,
    };
  }

  /**
   * 상품 재고 정보를 갱신합니다.
   * @param {string} productName - 상품명
   * @param {import('../types.js').SingleProductStockType} productStock - 갱신할 상품 재고 정보
   */
  #updateStock(productName, productStock) {
    const { normal, promotion } = productStock;
    const newStock = {
      ...InventoryManager.#makeStockInfo(normal || {}),
      ...InventoryManager.#makeStockInfo(promotion || {}),
    };
    return this.#inventoryMap.set(productName, newStock);
  }
}

export default InventoryManager;
