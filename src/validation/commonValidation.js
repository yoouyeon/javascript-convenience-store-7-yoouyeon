// @ts-check
import checkRuleSet from '../utils/checkRuleSet.js';

const commonValidation = Object.freeze({
  /** @type {import('../types.js').RuleSetType} */
  RULE_SET: Object.freeze({
    isEmpty: Object.freeze({
      isInvalid: (value) => value.trim() === '',
      errorMessage: '잘못된 입력입니다. 다시 입력해 주세요.',
    }),

    isYesOrNo: Object.freeze({
      isInvalid: (value) => !['Y', 'N'].includes(value),
      errorMessage: '잘못된 입력입니다. 다시 입력해 주세요.',
    }),
  }),

  checkEmpty(value) {
    checkRuleSet(value, {
      isEmpty: this.RULE_SET.isEmpty,
    });
  },

  checkYesOrNo(value) {
    checkRuleSet(value, {
      isEmpty: this.RULE_SET.isEmpty,
      isYesOrNo: this.RULE_SET.isYesOrNo,
    });
  },
});

export default commonValidation;
