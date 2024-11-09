// @ts-check

import CustomError from './CustomError.js';

/**
 *
 * @param {any} target
 * @param {import('../types.js').RuleSetType} ruleSet
 */
const checkRuleSet = (target, ruleSet) => {
  Object.values(ruleSet).forEach((rule) => {
    if (rule.isInvalid(target)) {
      throw new CustomError(rule.errorMessage);
    }
  });
};

export default checkRuleSet;
