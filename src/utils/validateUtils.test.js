import validateUtils from './validateUtils.js';

describe('유효성 유틸함수 테스트', () => {
  describe('문자열 유효성 검사 테스트', () => {
    test.each([
      { name: 'null', input: null },
      { name: '빈 문자열', input: '' },
      { name: '공백 문자열', input: ' ' },
      { name: '탭 문자열', input: '\t' },
    ])('문자열이 유효하지 않은 경우 false를 반환한다.: $name', ({ input }) => {
      const result = validateUtils.isValidString(input);
      expect(result).toBe(false);
    });

    test.each([
      { name: '문자열', input: 'a1b2c3' },
      { name: '공백이 포함된 문자열', input: 'a b c' },
    ])('문자열이 유효한 경우 true를 반환한다.: $name', ({ input }) => {
      const result = validateUtils.isValidString(input);
      expect(result).toBe(true);
    });
  });

  describe('숫자 유효성 검사 테스트', () => {
    test.each([
      { name: 'null', input: null },
      { name: '빈 문자열', input: '' },
      { name: '문자열', input: 'a1b2c3' },
      { name: '음수 문자열', input: '-123' },
      { name: '소수점 문자열', input: '123.45' },
      { name: '음수 소수점 문자열', input: '-123.45' },
      { name: 'Infinity', input: Infinity },
      { name: 'NaN', input: NaN },
    ])('숫자가 유효하지 않은 경우 false를 반환한다.: $name', ({ input }) => {
      expect(validateUtils.isValidNumber(input)).toBe(false);
    });

    test.each([
      { name: '0', input: 0 },
      { name: '양의 정수', input: 123 },
    ])('숫자가 유효한 경우 에러를 던지지 않는다.: $name', ({ input }) => {
      expect(() => validateUtils.isValidNumber(input)).not.toThrow();
    });
  });

  describe('날짜 유효성 검사 테스트', () => {});
});
