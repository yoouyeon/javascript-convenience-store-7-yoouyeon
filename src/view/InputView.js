// @ts-check
import { Console } from '@woowacourse/mission-utils';
import inputParser from '../utils/inputParser.js';
import OutputView from './OutputView.js';

/** @typedef {import('../utils/CustomError.js').default} CustomError */

// 추가 구매 수량 입력 메시지

const PURCHASE_INPUT_MESSAGE = Object.freeze({
  additionalPurchase: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
  purchaseProduct: '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
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
};

export default InputView;
