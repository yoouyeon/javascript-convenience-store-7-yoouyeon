// @ts-check
import { Console } from '@woowacourse/mission-utils';
import commonValidation from '../validation/commonValidation.js';
import OutputView from './OutputView.js';

/** @typedef {import('../utils/CustomError.js').default} CustomError */

// 추가 구매 수량 입력 메시지
const ADDITIONAL_PURCHASE_MESSAGE = '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n';

const InputView = {
  async getAdditionalPurchase() {
    const additionalPurchase = await Console.readLineAsync(ADDITIONAL_PURCHASE_MESSAGE);
    OutputView.printNewLine();
    return this.isYesOrNo(additionalPurchase);
  },

  /**
   * @param {string} userResponse - 사용자 응답
   * @returns {void}
   * @throw {CustomError} 유저 응답이 유효하지 않을 경우
   */
  isYesOrNo(userResponse) {
    commonValidation.checkYesOrNo(userResponse);
  },
};

export default InputView;
