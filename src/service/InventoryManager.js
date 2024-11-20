// @ts-check
import ProductStock from './ProductStock.js';
import CustomError from '../utils/CustomError.js';

/** @typedef {import('./ProductStock.js').default} ProductStockType */

class InventoryManager {
  /** @type {Map<string, ProductStockType>} */
  #inventoryMap;

  /**
   * @param {import('../types.js').ProductRawDataType} productsRawData - 파일에서 읽어온 재고 데이터
   */
  constructor(productsRawData) {
    this.#inventoryMap = new Map();
    productsRawData.forEach((product) => {
      const { name } = product;
      if (this.#inventoryMap.has(name)) this.#inventoryMap.get(name)?.setStockInfo(product);
      else this.#inventoryMap.set(name, new ProductStock(product));
    });
  }

  get currentInventory() {
    return this.#inventoryMap;
  }

  getPromoName(productName) {
    const productStock = this.#inventoryMap.get(productName);
    if (!productStock) throw new CustomError('존재하지 않는 상품입니다.');
    return productStock.promoName;
  }

  getPrice(productName) {
    const productStock = this.#inventoryMap.get(productName);
    if (!productStock) throw new CustomError('존재하지 않는 상품입니다.');
    return productStock.price;
  }

  /**
   * 구매 요청에 대해서 가능 여부를 확인하고 재고 정보를 반환합니다.
   * @param {string} productName - 구매할 상품명
   * @param {number} quantity - 구매할 수량
   * @returns {ProductStockType} - 해당 상품 재고 정보
   * @throw {import ('../utils/CustomError.js').default } - 재고가 없는 경우 에러를 발생시킵니다.
   */
  checkInventory(productName, quantity) {
    const productStock = this.#inventoryMap.get(productName);
    if (!productStock) throw new CustomError(`존재하지 않는 상품입니다. 다시 입력해 주세요.`);
    if (productStock.totalQuantity < quantity)
      throw new CustomError(`재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`);
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
    if (!productStock) throw new CustomError('존재하지 않는 상품입니다.');
    productStock.decreaseStock(quantity, isPromotion);
  }
}

export default InventoryManager;
