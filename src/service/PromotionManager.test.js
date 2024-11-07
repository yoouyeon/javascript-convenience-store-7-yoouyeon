import PromotionManager from './PromotionManager.js';

const makeFakePromotionMap = (fakePromotions) => {
  const promotionMap = new Map();
  fakePromotions.forEach((fakePromotion) => {
    const [promotionName, promotion] = fakePromotion;
    promotionMap.set(promotionName, promotion);
  });
  return promotionMap;
};

describe('프로모션 할인 테스트', () => {
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
        {
          buy: 2,
          get: 1,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
        },
      ],
      [
        'MD추천상품',
        {
          buy: 1,
          get: 1,
          startDate: new Date('2024-12-01'),
          endDate: new Date('2024-12-31'),
        },
      ],
    ]);

    // when
    const promotionManager = new PromotionManager(PROMOTION_DATA);

    // then
    expect(promotionManager.currentPromotions).toEqual(EXPECTED_PROMOTION_MAP);
  });
});
