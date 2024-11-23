import { Console } from '@woowacourse/mission-utils';

const WELCOME_MESSAGE = '안녕하세요. W편의점입니다.';
const INVENTORY_HEADER_MESSAGE = '현재 보유하고 있는 상품입니다.';
const RECEIPT_HEADER_MESSAGE = '==============W 편의점================';
const FREE_HEADER_MESSAGE = '=============증	정===============';
const TOTAL_HEADER_MESSAGE = '====================================';
const addComma = (price) => price.toLocaleString();
const convertQuantity = (quantity) => {
  if (!quantity || quantity === 0) return '재고 없음';
  return `${quantity}개`;
};

/** @typedef {import('../service/ProductStock.js').default} ProductStockType */

const OutputView = Object.freeze({
  showWelcomeMessage() {
    Console.print(WELCOME_MESSAGE);
  },

  /**
   * 재고 목록을 출력합니다.
   * @param {Map<string, ProductStockType>} inventory
   */
  showInventory(inventory) {
    Console.print(INVENTORY_HEADER_MESSAGE);
    this.printNewLine();
    inventory.forEach((stock, name) => {
      if (stock.hasPromotion)
        this.showProduct(name, stock.price, stock.promotionQuantity, stock.promoName);
      this.showProduct(name, stock.price, stock.normalQuantity, '');
    });
    this.printNewLine();
  },

  /**
   * 상품 목록 1개를 출력합니다.
   * @param {string} productName - 상품명
   */
  showProduct(productName, price, quantity, promoName) {
    Console.print(
      `- ${productName} ${addComma(price)}원 ${convertQuantity(quantity)} ${promoName}`
    );
  },

  /**
   * 영수증을 출력합니다. (구매 목록)
   * @param {Array<{productName: string, count: number, price: number}>} purchasedList
   */
  showPurchasedList(purchasedList) {
    Console.print(RECEIPT_HEADER_MESSAGE);
    Console.print(`${'상품명'.padEnd(15)}${'수량'.padEnd(10)}${'금액'.padEnd(10)}`);
    purchasedList.forEach(({ productName, count, price }) => {
      Console.print(
        `${productName.padEnd(15)} ${count.toString().padEnd(10)} ${addComma(price).padEnd(10)}`
      );
    });
  },

  /**
   * 영수증을 출력합니다. (증정 목록)
   * @param {Array<{productName: string, count: number}>} freeList
   */
  showFreeList(freeList) {
    Console.print(FREE_HEADER_MESSAGE);
    freeList.forEach(({ productName, count }) => {
      if (count === 0) return;
      Console.print(`${productName.padEnd(15)} ${count.toString().padEnd(10)}`);
    });
  },

  /**
   * 영수증을 출력합니다. (총 금액)
   *
   */
  showTotalPrint(total, promo, membership, final) {
    Console.print(TOTAL_HEADER_MESSAGE);
    Console.print(
      `${'총구매액'.padEnd(15)} ${total.count.toString().padEnd(10)} ${addComma(total.price).padEnd(10)}`
    );
    Console.print(`${'행사할인'.padEnd(25)}-${addComma(promo).padEnd(10)}`);
    Console.print(`${'멤버십할인'.padEnd(25)}-${addComma(membership).padEnd(10)}`);
    Console.print(`${'내실돈'.padEnd(25)}${addComma(final).padEnd(10)}`);
  },

  printNewLine() {
    Console.print('');
  },
});

export default OutputView;
