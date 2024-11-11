import mockNowDate from '../utils/test/mockNowDate.js';
import Promotion from './Promotion.js';

describe('프로모션 테스트', () => {
  describe('프로모션 적용 가능 여부 확인 테스트', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const PROMOTION_RAW_DATA = {
      name: '탄산3+1',
      buy: 3,
      get: 1,
      start_date: '2024-11-08',
      end_date: '2024-11-08',
    };

    test('프로모션 기간에 포함되는 경우, 프로모션 적용 가능 여부는 true이다.', () => {
      // given
      const promotion = new Promotion(PROMOTION_RAW_DATA);
      mockNowDate('2024-11-08');

      // when
      const isAvailable = promotion.isAvailable();

      // then
      expect(isAvailable).toBe(true);
    });

    test('프로모션 기간에 포함되지 않는 경우, 프로모션 적용 가능 여부는 false이다.', () => {
      // given
      const promotion = new Promotion(PROMOTION_RAW_DATA);
      mockNowDate('2024-11-09');

      // when
      const isAvailable = promotion.isAvailable();

      // then
      expect(isAvailable).toBe(false);
    });
  });

  describe('프로모션 적용 수량 계산 테스트', () => {
    const PROMOTION_RAW_DATA = {
      name: '탄산3+1',
      buy: 3,
      get: 1,
      start_date: '2024-11-08',
      end_date: '2024-11-08',
    };

    test.each([
      {
        quantity: 1,
        promotionStock: 4,
        expected: { promo: 0, free: 0, nonPromo: 1, total: 1 },
      },
      {
        quantity: 2,
        promotionStock: 4,
        expected: { promo: 0, free: 0, nonPromo: 2, total: 2 },
      },
      {
        quantity: 3,
        promotionStock: 4,
        expected: { promo: 3, free: 1, nonPromo: 0, total: 4 },
      },
      {
        quantity: 4,
        promotionStock: 4,
        expected: { promo: 3, free: 1, nonPromo: 0, total: 4 },
      },
      {
        quantity: 5,
        promotionStock: 4,
        expected: { promo: 3, free: 1, nonPromo: 1, total: 5 },
      },
      {
        quantity: 6,
        promotionStock: 4,
        expected: { promo: 3, free: 1, nonPromo: 2, total: 6 },
      },
      {
        quantity: 6,
        promotionStock: 10,
        expected: { promo: 6, free: 2, nonPromo: 0, total: 8 },
      },
    ])('최대 프로모션 적용 수량을 구한다.', (data) => {
      // given
      const { quantity, expected, promotionStock } = data;
      const promotion = new Promotion(PROMOTION_RAW_DATA);

      // when
      const fullQuantity = promotion.getFullQuantity(quantity, promotionStock);

      // then
      expect(fullQuantity).toEqual(expected);
    });

    test.each([
      { quantity: 1, expected: { buy: 0, get: 0, nonPromo: 1, total: 1 } },
      { quantity: 2, expected: { buy: 0, get: 0, nonPromo: 2, total: 2 } },
      { quantity: 3, expected: { buy: 3, get: 1, nonPromo: 0, total: 3 } },
      { quantity: 4, expected: { buy: 3, get: 1, nonPromo: 0, total: 4 } },
      { quantity: 5, expected: { buy: 3, get: 1, nonPromo: 1, total: 5 } },
      { quantity: 6, expected: { buy: 3, get: 1, nonPromo: 2, total: 6 } },
    ])(
      '프로모션이 { buy: 3, get: 1 } 일 때 $quantity개 구매할 경우, 프로모션 적용 수량은 $expected 이다.',
      () => {}
    );
  });
});
