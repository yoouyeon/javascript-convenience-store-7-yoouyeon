// @ts-check

import InventoryManager from './InventoryManager.js';
import PromotionManager from './PromotionManager.js';
import csvUtils from '../utils/csvUtils.js';
import OutputView from '../view/OutputView.js';

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
    this.#showStartupInfo();
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
   * 편의점 시작 정보를 출력합니다 (환영 인사, 재고 상태).
   */
  #showStartupInfo() {
    OutputView.showWelcomeMessage();
    OutputView.showInventory(this.#inventoryManager.currentInventory);
  }
}

export default ConvenienceStore;
