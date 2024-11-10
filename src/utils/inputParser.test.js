import inputParser from './inputParser.js';

describe('입력 파싱 테스트', () => {
  describe('구매 상품 파싱 테스트', () => {
    test.each([
      { input: '[사이다-2]', expected: [['사이다', 2]] },
      {
        input: '[사이다-2],[에너지바-10]',
        expected: [
          ['사이다', 2],
          ['에너지바', 10],
        ],
      },
    ])('상품명과 수량을 배열로 반환한다', ({ input, expected }) => {
      // when
      const result = inputParser.parseProducts(input);

      // then
      expect(result).toEqual(expected);
    });
    test('유효하지 않은 입력의 경우 에러를 던진다', () => {
      // given
      const INVALID_INPUT = '사이다-2';

      // then
      expect(() => inputParser.parseProducts(INVALID_INPUT)).toThrow();
    });
  });

  describe('Y/N 입력 파싱 테스트', () => {
    test('Y 입력의 경우 true를 반환한다', () => {
      // given
      const INPUT = 'Y';

      // when
      const result = inputParser.yesOrNo(INPUT);

      // then
      expect(result).toBe(true);
    });
    test('N 입력의 경우 false를 반환한다', () => {
      // given
      const INPUT = 'N';

      // when
      const result = inputParser.yesOrNo(INPUT);

      // then
      expect(result).toBe(false);
    });
    test('유효하지 않은 입력의 경우 에러를 던진다', () => {
      // given
      const INVALID_INPUT = 'Yes';

      // then
      expect(() => inputParser.yesOrNo(INVALID_INPUT)).toThrow();
    });
  });
});
