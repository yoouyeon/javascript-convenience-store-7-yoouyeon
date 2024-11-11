// @ts-check
import { Console } from '@woowacourse/mission-utils';
import inputParser from '../utils/inputParser.js';
import OutputView from './OutputView.js';

/** @typedef {import('../utils/CustomError.js').default} CustomError */

const PURCHASE_INPUT_MESSAGE = Object.freeze({
  additionalPurchase: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
  purchaseProduct: '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
  exceedPromotionQuantity: (productName, exceedQuantity) =>
    `현재 ${productName} ${exceedQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
  promotionInfo: (productName, freeQuantity) =>
    `현재 ${productName}은(는) ${freeQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
});

// TODO : 메소드명 다시 고민해보기

const InputView = {
  /** 구매할 상품과 수량을 입력받습니다. */
  async readProducts() {
    const input = await Console.readLineAsync(PURCHASE_INPUT_MESSAGE.purchaseProduct);
    const products = inputParser.parseProducts(input);
    OutputView.printNewLine();
    return products;
  },

  /** 구매가 완료된 후 추가 구매 여부를 입력받습니다. */
  async getAdditionalPurchase() {
    const additionalPurchase = await Console.readLineAsync(
      PURCHASE_INPUT_MESSAGE.additionalPurchase
    );
    const result = inputParser.yesOrNo(additionalPurchase);
    OutputView.printNewLine();
    return result;
  },

  /**
   * 프로모션 할인 수량 초과 시 추가 구매 여부를 입력받습니다.
   * @param {string} productName - 상품명
   * @param {number} exceedQuantity - 프로모션 할인 수량 초과 수량
   * @returns {Promise<boolean>} 추가 구매 여부
   */
  async getBuyExceed(productName, exceedQuantity) {
    const input = await Console.readLineAsync(
      PURCHASE_INPUT_MESSAGE.exceedPromotionQuantity(productName, exceedQuantity)
    );
    const result = inputParser.yesOrNo(input);
    OutputView.printNewLine();
    return result;
  },

  /**
   * 프로모션 혜택 안내를 출력하고 추가 구매 여부를 입력받습니다.
   * @param {string} productName - 상품명
   * @param {number} freeQuantity - 추가 구매 혜택 수량
   * @returns {Promise<boolean>} 추가 구매 여부
   */
  async getBuyMore(productName, freeQuantity) {
    const input = await Console.readLineAsync(
      PURCHASE_INPUT_MESSAGE.promotionInfo(productName, freeQuantity)
    );
    const result = inputParser.yesOrNo(input);
    OutputView.printNewLine();
    return result;
  },
};

export default InputView;
