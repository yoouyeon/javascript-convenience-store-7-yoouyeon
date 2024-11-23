// @ts-check
import validateUtils from './validateUtils.js';
import CustomError from './CustomError.js';
import INPUT_ERROR_MESSAGES from '../constants/inputErrorMessages.js';
import PRODUCT_ERROR_MESSAGES from '../constants/productErrorMessages.js';

const inputParser = Object.freeze({
  /**
   * 사용자 입력을 받아서 상품명과 수량 배열을 반환합니다.
   * @param {string} input - 사용자 입력
   * @returns {Array<[string, number]>} 상품명과 수량 배열
   */
  parseProducts(input) {
    inputParser.checkValidInput(input);
    const rawProducts = input.split(',');
    return rawProducts.map((rawProduct) => {
      inputParser.checkValidFormat(rawProduct);
      const [name, quantity] = rawProduct.trim().slice(1, -1).split('-');
      return [name, Number(quantity)];
    });
  },
  /**
   * Y/N 유형의 사용자 응답을 받아서 boolean 타입으로 반환합니다
   * @param {string} input - 사용자 응답
   * @returns {boolean}
   * @throw {CustomError} 유저 응답이 유효하지 않을 경우
   */
  yesOrNo(input) {
    inputParser.checkValidYesOrNo(input);
    return input === 'Y';
  },

  // 유효한 입력이 아닌 경우 에러를 발생시킵니다.
  checkValidInput(input) {
    if (!validateUtils.isValidString(input))
      throw new CustomError(INPUT_ERROR_MESSAGES.invalidInput);
  },

  // 유효한 yes/no 입력이 아닌 경우 에러를 발생시킵니다.
  checkValidYesOrNo(input) {
    if (!validateUtils.isValidYesOrNo(input))
      throw new CustomError(INPUT_ERROR_MESSAGES.invalidInput);
  },

  // 유효한 포맷이 아닌 경우 에러를 발생시킵니다.
  checkValidFormat(input) {
    const PRODUCT_DATA_FORMAT = /^\[[가-힣a-zA-Z0-9]+-\d+\]/;
    if (!PRODUCT_DATA_FORMAT.test(input))
      throw new CustomError(PRODUCT_ERROR_MESSAGES.invalidFormat);
  },
});

export default inputParser;
