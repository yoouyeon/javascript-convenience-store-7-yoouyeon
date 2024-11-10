// @ts-check

import InventoryManager from './InventoryManager.js';
import PromotionManager from './PromotionManager.js';
import csvUtils from '../utils/csvUtils.js';
import OutputView from '../view/OutputView.js';
import InputView from '../view/InputView.js';
import retryAsyncWithLog from '../utils/retryAsyncWithLog.js';

const PRODUCTS_FILE_PATH = 'public/products.md';
const PROMOTIONS_FILE_PATH = 'public/promotions.md';

/** @typedef {import('../types.js').ProductRawDataType} ProductRawDataType */
/** @typedef {import('../types.js').PromotionRawDataType} PromotionRawDataType */

class ConvenienceStore {
  #inventoryManager;

  #promotionManager;

  /**
   * 편의점 데이터를 초기화합니다.
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
    const additionalPurchase = await retryAsyncWithLog(
      InputView.getAdditionalPurchase.bind(InputView)
    );
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
    // 1. 상품 구매 정보를 입력받는다.
    const purchaseInfo = await retryAsyncWithLog(this.#inputPurchaseInfo.bind(this));
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
}

export default ConvenienceStore;
