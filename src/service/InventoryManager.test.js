import InventoryManager from './InventoryManager.js';

// TODO : 네이밍 다시 확인하기 (통일되지 않은 부분이 있을 수 있음)
// TODO : 가독성 고민해보기

const makeFakeStockMap = (fakeStocks) => {
  const stockMap = new Map();
  fakeStocks.forEach((fakeStock) => {
    const [productName, stock] = fakeStock;
    stockMap.set(productName, stock);
  });
  return stockMap;
};

describe('재고 관리 테스트', () => {
  const PRODUCT_DATA = [
    { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' },
    { name: '콜라', price: '1000', quantity: '10', promotion: 'null' },
    { name: '사이다', price: '1000', quantity: '8', promotion: 'null' },
    { name: '오렌지주스', price: '1800', quantity: '9', promotion: 'MD추천상품' },
  ];

  test('상품 목록을 이용해서 재고를 초기화한다.', () => {
    // given
    const EXPECTED_STOCK_MAP = makeFakeStockMap([
      [
        '콜라',
        {
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
        },
      ],
      ['사이다', { normal: { price: 1000, quantity: 8 } }],
      [
        '오렌지주스',
        {
          promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' },
          normal: { price: 1800, quantity: 0 },
        },
      ],
    ]);

    // when
    const inventoryManager = new InventoryManager(PRODUCT_DATA);

    // then
    expect(inventoryManager.currentInventory).toEqual(EXPECTED_STOCK_MAP);
  });

  describe('구매 가능 여부 확인 테스트', () => {
    test('재고 정보가 없는 상품은 에러를 발생시킨다.', () => {
      // given
      const productStockManager = new InventoryManager(PRODUCT_DATA);
      const NOT_EXIST_PRODUCT = '제로콜라';

      // then
      expect(() => productStockManager.checkInventory(NOT_EXIST_PRODUCT, 1)).toThrow();
    });

    test.each([
      { productName: '사이다', quantity: 9 },
      { productName: '오렌지주스', quantity: 10 },
      { productName: '콜라', quantity: 21 },
    ])('재고가 부족한 상품은 에러를 발생시킨다.', ({ productName, quantity }) => {
      // given
      const productStockManager = new InventoryManager(PRODUCT_DATA);

      // then
      expect(() => productStockManager.checkInventory(productName, quantity)).toThrow();
    });

    test.each([
      {
        input: { productName: '사이다', quantity: 8 },
        expected: { normal: { price: 1000, quantity: 8 } },
      },
      {
        input: { productName: '오렌지주스', quantity: 9 },
        expected: {
          promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' },
          normal: { price: 1800, quantity: 0 },
        },
      },
      {
        input: { productName: '콜라', quantity: 10 },
        expected: {
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
        },
      },
      {
        input: { productName: '콜라', quantity: 20 },
        expected: {
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
        },
      },
    ])('재고가 충분한 상품은 재고를 반환한다.', ({ input, expected }) => {
      // given
      const inventoryManager = new InventoryManager(PRODUCT_DATA);
      const { productName, quantity } = input;

      // when
      const purchaseResponse = inventoryManager.checkInventory(productName, quantity);

      // then
      expect(purchaseResponse).toEqual(expected);
    });
  });

  describe('재고 차감 테스트', () => {
    test.each([
      {
        input: { productName: '오렌지주스', quantity: 7 },
        expected: [
          [
            '콜라',
            {
              normal: { price: 1000, quantity: 10 },
              promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
            },
          ],
          ['사이다', { normal: { price: 1000, quantity: 8 } }],
          [
            '오렌지주스',
            {
              promotion: { price: 1800, quantity: 2, promotion: 'MD추천상품' },
              normal: { price: 1800, quantity: 0 },
            },
          ],
        ],
      },
      {
        input: { productName: '콜라', quantity: 11 },
        expected: [
          [
            '콜라',
            {
              normal: { price: 1000, quantity: 9 },
              promotion: { price: 1000, quantity: 0, promotion: '탄산2+1' },
            },
          ],
          ['사이다', { normal: { price: 1000, quantity: 8 } }],
          [
            '오렌지주스',
            {
              promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' },
              normal: { price: 1800, quantity: 0 },
            },
          ],
        ],
      },
      {
        input: { productName: '사이다', quantity: 8 },
        expected: [
          [
            '콜라',
            {
              normal: { price: 1000, quantity: 10 },
              promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
            },
          ],
          ['사이다', { normal: { price: 1000, quantity: 0 } }],
          [
            '오렌지주스',
            {
              promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' },
              normal: { price: 1800, quantity: 0 },
            },
          ],
        ],
      },
    ])('프로모션 중일때는 프로모션 재고를 우선으로 차감한다.', ({ input, expected }) => {
      // given
      const inventoryManager = new InventoryManager(PRODUCT_DATA);
      const EXPECTED_STOCK_MAP = makeFakeStockMap(expected);
      const { productName, quantity } = input;

      // when
      inventoryManager.decreaseStock(productName, quantity, true);

      // then
      expect(inventoryManager.currentInventory).toEqual(EXPECTED_STOCK_MAP);
    });

    test.each([
      {
        input: { productName: '사이다', quantity: 1 },
        expected: [
          [
            '콜라',
            {
              normal: { price: 1000, quantity: 10 },
              promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
            },
          ],
          ['사이다', { normal: { price: 1000, quantity: 7 } }],
          [
            '오렌지주스',
            {
              promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' },
              normal: { price: 1800, quantity: 0 },
            },
          ],
        ],
      },
      {
        input: { productName: '오렌지주스', quantity: 9 },
        expected: [
          [
            '콜라',
            {
              normal: { price: 1000, quantity: 10 },
              promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
            },
          ],
          ['사이다', { normal: { price: 1000, quantity: 8 } }],
          [
            '오렌지주스',
            {
              promotion: { price: 1800, quantity: 0, promotion: 'MD추천상품' },
              normal: { price: 1800, quantity: 0 },
            },
          ],
        ],
      },
      {
        input: { productName: '콜라', quantity: 11 },
        expected: [
          [
            '콜라',
            {
              normal: { price: 1000, quantity: 0 },
              promotion: { price: 1000, quantity: 9, promotion: '탄산2+1' },
            },
          ],
          ['사이다', { normal: { price: 1000, quantity: 8 } }],
          [
            '오렌지주스',
            {
              promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' },
              normal: { price: 1800, quantity: 0 },
            },
          ],
        ],
      },
    ])('프로모션 중이 아닌 경우 일반 재고를 우선으로 차감한다.', ({ input, expected }) => {
      // given
      const inventoryManager = new InventoryManager(PRODUCT_DATA);
      const EXPECTED_STOCK_MAP = makeFakeStockMap(expected);
      const { productName, quantity } = input;

      // when
      inventoryManager.decreaseStock(productName, quantity, false);

      // then
      expect(inventoryManager.currentInventory).toEqual(EXPECTED_STOCK_MAP);
    });
  });
});
