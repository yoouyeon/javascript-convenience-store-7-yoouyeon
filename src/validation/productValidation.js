// @ts-check
import checkRuleSet from '../utils/checkRuleSet.js';

const productValidation = Object.freeze({
  /** @type {import('../types.js').RuleSetType} */
  RULE_SET: Object.freeze({
    isProductFormat: Object.freeze({
      isInvalid: (value) => !/^\[[가-힣a-zA-Z0-9]+-\d+\]/.test(value),
      errorMessage:
        '올바르지 않은 형식으로 입력했습니다. 다시 입력해주세요. (예: [사이다-2],[감자칩-1])',
    }),

    isValidType: Object.freeze({
      isInvalid: (value) => {
        const [name, quantity] = value;
        return typeof name !== 'string' || Number.isNaN(Number(quantity));
      },
      errorMessage:
        '올바르지 않은 형식으로 입력했습니다. 다시 입력해주세요. (예: [사이다-2],[감자칩-1])',
    }),
  }),

  checkFormat(value) {
    checkRuleSet(value, {
      isProductFormat: this.RULE_SET.isProductFormat,
    });
  },

  checkProductData(value) {
    checkRuleSet(value, {
      isValidType: this.RULE_SET.isValidType,
    });
  },
});

export default productValidation;
