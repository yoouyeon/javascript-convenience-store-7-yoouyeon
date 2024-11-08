import { Console } from '@woowacourse/mission-utils';

const WELCOME_MESSAGE = '안녕하세요. W편의점입니다.';
const INVENTORY_HEADER_MESSAGE = '현재 보유하고 있는 상품입니다.';
const addComma = (price) => price.toLocaleString();

const OutputView = Object.freeze({
  showWelcomeMessage() {
    Console.print(WELCOME_MESSAGE);
  },

  /**
   * 재고 목록을 출력합니다.
   * @param {import('../types.js').ProductStockType} inventory
   */
  showInventory(inventory) {
    Console.print(INVENTORY_HEADER_MESSAGE);
    this.printNewLine();
    inventory.forEach((productStock, productName) => {
      const { normal, promotion } = productStock;
      if (promotion) this.showProduct(productName, promotion);
      if (normal) this.showProduct(productName, normal);
    });
    this.printNewLine();
  },

  /**
   * 상품 목록 1개를 출력합니다.
   * @param {string} productName - 상품명
   * @param {import('../types.js').ProductStockInfoType} productStock - 상품 재고 정보
   */
  showProduct(productName, productStock) {
    const { price, quantity: originalQuantity, promotion: originalPromotion } = productStock;
    const quantity = originalQuantity || '재고 없음';
    const promotion = (originalPromotion !== 'null' && originalPromotion) || '';
    Console.print(`- ${productName} ${addComma(price)}원 ${quantity}개 ${promotion}`);
  },

  printNewLine() {
    Console.print('');
  },
});

export default OutputView;
