// @ts-check
class InventoryManager {
  /** @type {import('../types.js').ProductStockType} */
  #inventoryMap;
  // TODO : 합칠 수 있는 메서드 정리하기
  // TODO : 네이밍 다시 확인하기 (통일되지 않은 부분이 있을 수 있음)

  /**
   * @constructor
   * @param {import('../types.js').ProductRawDataType} productsRawData - 파일에서 읽어온 재고 데이터
   */
  constructor(productsRawData) {
    this.#inventoryMap = new Map();
    this.#initInventoryMap(productsRawData);
  }

  get currentInventory() {
    return this.#inventoryMap;
  }

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
    if (!price || !quantity || Number(quantity) <= 0) return {};
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
   * 구매 요청에 대해서 가능 여부와 재고 정보를 반환합니다.
   * @param {string} productName - 구매할 상품명
   * @param {number} quantity - 구매할 수량
   * @returns {import('../types.js').PurchaseResponseType} - 구매 가능 여부와 해당 상품 재고 정보
   */
  isAvailableToPurchase(productName, quantity) {
    const productStock = this.#inventoryMap.get(productName);
    if (!productStock) return { isAvailable: false };
    const availableProductStock = InventoryManager.#checkStock(productStock, quantity);
    if (!availableProductStock) return { isAvailable: false };
    return { isAvailable: true, ...availableProductStock };
  }

  /**
   * 상품 재고 수량과 구매 수량을 비교하여 구매 가능한 경우 해당 상품 재고 정보를 반환합니다.
   * @param {import('../types.js').SingleProductStockType} productStock - 상품 재고 정보
   * @param {number} quantity - 구매할 수량
   * @returns {import('../types.js').SingleProductStockType | undefined} - 구매 가능할 경우 해당 상품 재고 정보
   */
  static #checkStock(productStock, quantity) {
    const { normal, promotion } = productStock;
    const totalQuantity = (normal?.quantity || 0) + (promotion?.quantity || 0);
    if (totalQuantity < quantity) return undefined;
    return productStock;
  }

  /**
   * 상품 재고를 차감합니다.
   * @param {string} productName - 상품명
   * @param {import('../types.js').RequestStockType} quantity - 차감할 상품 재고 양
   */
  decreaseStock(productName, quantity) {
    const productStock = this.#inventoryMap.get(productName);
    this.#updateStock(productName, {
      normal: InventoryManager.#decreaseStockQuantity(productStock?.normal, quantity.normal),
      promotion: InventoryManager.#decreaseStockQuantity(
        productStock?.promotion,
        quantity.promotion
      ),
    });
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
    // console.log(productName);
    // console.log(normal);
    // console.log(promotion);
    if ((!normal || normal.quantity <= 0) && (!promotion || promotion.quantity <= 0))
      return this.#inventoryMap.delete(productName);
    const newStock = {
      ...InventoryManager.#makeStockInfo(normal || {}),
      ...InventoryManager.#makeStockInfo(promotion || {}),
    };
    return this.#inventoryMap.set(productName, newStock);
  }
}

export default InventoryManager;
