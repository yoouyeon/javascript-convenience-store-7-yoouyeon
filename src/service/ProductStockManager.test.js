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
  test('상품 목록을 이용해서 재고를 초기화한다.', () => {
    // given
    const PRODUCT_DATA = [
      { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' },
      { name: '콜라', price: '1000', quantity: '10', promotion: 'null' },
      { name: '사이다', price: '1000', quantity: '8', promotion: '탄산2+1' },
      { name: '오렌지주스', price: '1800', quantity: '9', promotion: 'MD추천상품' },
    ];
    const EXPECTED_STOCK_MAP = makeFakeStockMap([
      [
        '콜라',
        {
          normal: { price: 1000, quantity: 10 },
          promotion: { price: 1000, quantity: 10, promotion: '탄산2+1' },
        },
      ],
      ['사이다', { promotion: { price: 1000, quantity: 8, promotion: '탄산2+1' } }],
      ['오렌지주스', { promotion: { price: 1800, quantity: 9, promotion: 'MD추천상품' } }],
    ]);

    // when
    const productStockManager = new ProductStockManager(PRODUCT_DATA);

    // then
    expect(productStockManager.currentStock).toEqual(EXPECTED_STOCK_MAP);
  });
});
