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
}

export default ProductStockManager;
