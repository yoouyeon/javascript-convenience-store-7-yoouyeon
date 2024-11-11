// @ts-check

import InventoryManager from './InventoryManager.js';
import PromotionManager from './PromotionManager.js';
import csvUtils from '../utils/csvUtils.js';
import OutputView from '../view/OutputView.js';
import InputView from '../view/InputView.js';
import retryAsync from '../utils/retryAsync.js';

const PRODUCTS_FILE_PATH = 'public/products.md';
const PROMOTIONS_FILE_PATH = 'public/promotions.md';

/** @typedef {import('../types.js').ProductRawDataType} ProductRawDataType */
/** @typedef {import('../types.js').PromotionRawDataType} PromotionRawDataType */

class ConvenienceStore {
  // ========================
  // 1. Member Variables
  // ========================
  #inventoryManager;

  #promotionManager;

  // ========================
  // 2. Public Methods
  // ========================

  /**
   * 편의점 재고 및 프로모션 데이터를 초기화합니다.
   */
  async init() {
    const productRawData = /** @type {ProductRawDataType} */ (
      await csvUtils.readParsedCsv(PRODUCTS_FILE_PATH)
    );
    this.#inventoryManager = new InventoryManager(productRawData);
    const promotionRawData = /** @type {PromotionRawDataType} */ (
      await csvUtils.readParsedCsv(PROMOTIONS_FILE_PATH)
    );
    this.#promotionManager = new PromotionManager(promotionRawData);
  }

  /**
   * 편의점 기능을 실행합니다.
   */
  async run() {
    this.#checkIsInitialized();
    this.#processPurchase();
  }

  // ========================
  // 3. Private Methods
  // ========================

  /**
   * 편의점 데이터가 초기화되었는지 확인합니다.
   * @throws {Error} 편의점 데이터가 설정되지 않았을 경우
   */
  #checkIsInitialized() {
    if (!this.#inventoryManager || !this.#promotionManager) {
      throw new Error('편의점 데이터가 설정되지 않았습니다.');
    }
  }

  /**
   * 구매 프로세스를 실행합니다.
   */
  async #processPurchase() {
    this.#showStartupInfo();
    await this.#purchaseProduct();
    const additionalPurchase = await retryAsync(InputView.getAdditionalPurchase.bind(InputView));
    if (additionalPurchase) {
      this.#processPurchase();
    }
  }

  /**
   * 편의점 시작 정보를 출력합니다 (환영 인사, 재고 상태).
   */
  #showStartupInfo() {
    OutputView.showWelcomeMessage();
    OutputView.showInventory(this.#inventoryManager.currentInventory);
  }

  /**
   * 상품 구매를 처리합니다.
   */
  async #purchaseProduct() {
    const purchaseInfo = await retryAsync(this.#inputPurchaseInfo.bind(this));
    const promotionResult = await this.#applyPromotion(purchaseInfo);
    // 차감하기
    this.#decreaseStock(promotionResult);
    return promotionResult;
  }

  /**
   * 상품 구매 정보를 입력받고 재고 확인을 수행합니다.
   */
  async #inputPurchaseInfo() {
    const products = await InputView.readProducts();
    products.forEach((product) => {
      const [name, quantity] = product;
      this.#inventoryManager.checkInventory(name, quantity);
    });
    return products;
  }

  /**
   * 구매 정보에 프로모션을 적용합니다.
   * @param {Array<[string, number]>} purchaseInfo - 구매 정보
   * @returns {Promise<Array<{productName: string, quantity: import('../types.js').PromotionQuantityType}>>}
   */
  async #applyPromotion(purchaseInfo) {
    const results = await Promise.all(
      purchaseInfo.map(async ([productName, purchaseQuantity]) => {
        const quantity = await this.#applyEachPromotion(productName, purchaseQuantity);
        return { productName, quantity };
      })
    );
    return results;
  }

  /**
   * 개별 상품에 프로모션을 적용합니다.
   */
  async #applyEachPromotion(productName, count) {
    const stock = this.#inventoryManager.checkInventory(productName, count);
    const result = await this.#promotionManager.applyPromotion({
      productName,
      count,
      promoStock: stock.promotion,
    });
    return result;
  }

  /**
   * 상품 재고를 차감합니다.
   * @param {Array<{productName: string, quantity: import('../types.js').PromotionQuantityType}>} promotionResult - 프로모션 적용 결과
   */
  #decreaseStock(promotionResult) {
    promotionResult.forEach(({ productName, quantity }) => {
      const promoName = this.#inventoryManager.getPromoName(productName);
      const promoAvailability = this.#promotionManager.getPromoAvailability(promoName);
      this.#inventoryManager.decreaseStock(productName, quantity.total, promoAvailability);
    });
  }
}

export default ConvenienceStore;
