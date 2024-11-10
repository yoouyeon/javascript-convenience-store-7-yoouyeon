// @ts-check
import commonValidation from '../validation/commonValidation.js';
import productValidation from '../validation/productValidation.js';

const inputParser = Object.freeze({
  /**
   * 사용자 입력을 받아서 상품명과 수량 배열을 반환합니다.
   * @param {string} input - 사용자 입력
   * @returns {Array<[string, number]>} 상품명과 수량 배열
   */
  parseProducts(input) {
    commonValidation.checkEmpty(input);
    const rawProducts = input.split(',');
    return rawProducts.map((rawProduct) => {
      productValidation.checkFormat(rawProduct);
      const [name, quantity] = rawProduct.trim().slice(1, -1).split('-');
      productValidation.checkProductData([name, quantity]);
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
    commonValidation.checkYesOrNo(input);
    return input === 'Y';
  },
});

export default inputParser;
