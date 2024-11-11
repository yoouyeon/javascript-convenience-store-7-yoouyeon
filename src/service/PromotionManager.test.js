import { Console } from '@woowacourse/mission-utils';
import PromotionManager from './PromotionManager.js';
import Promotion from './Promotion.js';
import mockQuestions from '../utils/test/mockQuestions.js';

const makeFakePromotionMap = (fakePromotions) => {
  const promotionMap = new Map();
  fakePromotions.forEach((fakePromotion) => {
    const [promotionName, promotion] = fakePromotion;
    promotionMap.set(promotionName, promotion);
  });
  return promotionMap;
};

describe('프로모션 할인 테스트', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const PROMOTION_DATA = [
    {
      name: '탄산2+1',
      buy: '2',
      get: '1',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
    },
    {
      name: 'MD추천상품',
      buy: '1',
      get: '1',
      start_date: '2024-12-01',
      end_date: '2024-12-31',
    },
  ];
  test('프로모션 목록을 이용해서 프로모션 맵을 초기화한다.', () => {
    // given
    const EXPECTED_PROMOTION_MAP = makeFakePromotionMap([
      [
        '탄산2+1',
        new Promotion({
          name: '탄산2+1',
          buy: '2',
          get: '1',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        }),
      ],
      [
        'MD추천상품',
        new Promotion({
          name: 'MD추천상품',
          buy: '1',
          get: '1',
          start_date: '2024-12-01',
          end_date: '2024-12-31',
        }),
      ],
    ]);

    // when
    const promotionManager = new PromotionManager(PROMOTION_DATA);

    // then
    expect(promotionManager.currentPromotions).toEqual(EXPECTED_PROMOTION_MAP);
  });

  describe('프로모션 적용 테스트', () => {
    test('프로모션 재고가 맞는 경우에는 추가 입력 없이 프로모션을 적용한 재고를 반환한다.', async () => {
      // given
      const promotionManager = new PromotionManager(PROMOTION_DATA);
      const productName = '사이다';
      const quantity = 3;
      const productStock = {
        normal: { price: 1000, quantity: 2 },
        promotion: { price: 1000, quantity: 3, promotion: '탄산2+1' },
      };
      const expected = { promo: 2, free: 1, nonPromo: 0, total: 3 };

      // when
      const result = await promotionManager.applyPromotion({
        productName,
        count: quantity,
        promoStock: productStock.promotion,
      });

      // then
      expect(result).toEqual(expected);
    });

    test.each([
      {
        productName: '사이다',
        quantity: 6,
        productStock: {
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 3, promotion: '탄산2+1' },
        },
        userInput: 'Y',
        expected: { promo: 2, free: 1, nonPromo: 3, total: 6 },
      },
      {
        productName: '사이다',
        quantity: 6,
        productStock: {
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 3, promotion: '탄산2+1' },
        },
        userInput: 'N',
        expected: { promo: 2, free: 1, nonPromo: 0, total: 3 },
      },
    ])('프로모션 재고가 부족한 경우에는 일부 수량을 정가로 구매할지 물어본다.', async (data) => {
      // given
      const promotionManager = new PromotionManager(PROMOTION_DATA);
      const { productName, quantity, productStock, userInput, expected } = data;
      mockQuestions([userInput]);

      // when
      const result = await promotionManager.applyPromotion({
        productName,
        count: quantity,
        promoStock: productStock.promotion,
      });

      // then
      expect(result).toEqual(expected);
      expect(Console.readLineAsync).toHaveBeenCalledTimes(1);
    });
  });
});
