import { Console } from '@woowacourse/mission-utils';
import OutputView from './OutputView.js';

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
   * @returns {boolean} 유저 응답이 "Y"인 경우 true, "N"인 경우 false
   */
  isYesOrNo(userResponse) {
    return userResponse === 'Y';
  },
};

export default InputView;
