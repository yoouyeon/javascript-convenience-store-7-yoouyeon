// @ts-check

class ProductStockManager {
  /** @type {import('../types.js').ProductStockType} */
  #productStockMap;

  /**
   * @constructor
   * @param {import('../types.js').ProductRawDataType} productsRawData - 파일에서 읽어온 재고 데이터
   */
  constructor(productsRawData) {
    this.#productStockMap = new Map();
    this.#initProductStockMap(productsRawData);
  }

  get currentStock() {
    return this.#productStockMap;
  }

  /**
   * @param {import('../types.js').ProductRawDataType} parsedProductData - 상품명, 가격, 수량, 프로모션 정보
   */
  #initProductStockMap(parsedProductData) {
    parsedProductData.forEach((product) => {
      const { name, ...rest } = product;
      const productInfo = ProductStockManager.#makeProductInfo(rest);
      this.#setProductStock(name, productInfo);
    });
  }

  /**
   * @param {Omit<import('../types.js').SingleProductRawDataType, 'name'>} productInfo - 가격, 수량, 프로모션 정보
   * @returns {import('../types.js').SingleProductStockType}
   */
  static #makeProductInfo(productInfo) {
    const { price, quantity, promotion } = productInfo;
    if (promotion === 'null') {
      return { normal: { price: Number(price), quantity: Number(quantity) } };
    }
    return { promotion: { price: Number(price), quantity: Number(quantity), promotion } };
  }

  /**
   * @param {string} productName
   * @param {import('../types.js').SingleProductStockType} productStock
   */
  #setProductStock(productName, productStock) {
    if (this.#productStockMap.has(productName))
      this.#productStockMap.set(productName, {
        ...this.#productStockMap.get(productName),
        ...productStock,
      });
    else this.#productStockMap.set(productName, { ...productStock });
  }

  /**
   * 구매 요청에 대해서 가능 여부와 재고 정보를 반환합니다.
   * @param {string} productName - 구매할 상품명
   * @param {number} quantity - 구매할 수량
   * @returns {import('../types.js').PurchaseResponseType} - 구매 가능 여부와 해당 상품 재고 정보
   */
  isAvailableToPurchase(productName, quantity) {
    const productStock = this.#productStockMap.get(productName);
    if (!productStock) return { isAvailable: false };
    const availableProductStock = ProductStockManager.#checkProductStock(productStock, quantity);
    if (!availableProductStock) return { isAvailable: false };
    return { isAvailable: true, ...availableProductStock };
  }

  /**
   * 상품 재고 수량과 구매 수량을 비교하여 구매 가능한 경우 해당 상품 재고 정보를 반환합니다.
   * @param {import('../types.js').SingleProductStockType} productStock - 상품 재고 정보
   * @param {number} quantity - 구매할 수량
   * @returns {import('../types.js').SingleProductStockType | undefined} - 구매 가능할 경우 해당 상품 재고 정보
   */
  static #checkProductStock(productStock, quantity) {
    const { normal, promotion } = productStock;
    const totalQuantity = (normal?.quantity || 0) + (promotion?.quantity || 0);
    if (totalQuantity < quantity) return undefined;
    return productStock;
  }
}

export default ProductStockManager;
