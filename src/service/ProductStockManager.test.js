import ProductStockManager from './ProductStockManager.js';

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
      ['오렌지주스', { promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' } }],
    ]);

    // when
    const productStockManager = new ProductStockManager(PRODUCT_DATA);

    // then
    expect(productStockManager.currentStock).toEqual(EXPECTED_STOCK_MAP);
  });

  describe('구매 가능 여부 확인 테스트', () => {
    test('재고 정보가 없는 상품은 구매 불가능하다.', () => {
      // given
      const productStockManager = new ProductStockManager(PRODUCT_DATA);

      // when
      const purchaseResponse = productStockManager.isAvailableToPurchase('제로콜라', 1);

      // then
      expect(purchaseResponse).toEqual({
        isAvailable: false,
      });
    });

    test.each([
      { productName: '사이다', quantity: 9 },
      { productName: '오렌지주스', quantity: 10 },
      { productName: '콜라', quantity: 21 },
    ])('재고가 부족한 상품은 구매 불가능하다.', ({ productName, quantity }) => {
      // given
      const productStockManager = new ProductStockManager(PRODUCT_DATA);

      // when
      const purchaseResponse = productStockManager.isAvailableToPurchase(productName, quantity);

      // then
      expect(purchaseResponse).toEqual({
        isAvailable: false,
      });
    });

    test.each([
      {
        input: { productName: '사이다', quantity: 8 },
        expected: { isAvailable: true, normal: { price: 1000, quantity: 8 } },
      },
      {
        input: { productName: '오렌지주스', quantity: 9 },
        expected: {
          isAvailable: true,
          promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' },
        },
      },
      {
        input: { productName: '콜라', quantity: 10 },
        expected: {
          isAvailable: true,
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
        },
      },
      {
        input: { productName: '콜라', quantity: 20 },
        expected: {
          isAvailable: true,
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
        },
      },
    ])('재고가 충분한 상품은 구매 가능하다.', ({ input, expected }) => {
      // given
      const productStockManager = new ProductStockManager(PRODUCT_DATA);
      const { productName, quantity } = input;

      // when
      const purchaseResponse = productStockManager.isAvailableToPurchase(productName, quantity);

      // then
      expect(purchaseResponse).toEqual(expected);
    });
  });
});
