// @ts-check
import checkRuleSet from '../utils/checkRuleSet.js';

const commonValidation = Object.freeze({
  /** @type {import('../types.js').RuleSetType} */
  RULE_SET: Object.freeze({
    isEmpty: Object.freeze({
      isInvalid: (value) => value.trim() === '',
      errorMessage: '빈 값은 입력할 수 없습니다.',
    }),

    isYesOrNo: Object.freeze({
      isInvalid: (value) => !['Y', 'N'].includes(value),
      errorMessage: 'Y 또는 N을 입력해주세요.',
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
