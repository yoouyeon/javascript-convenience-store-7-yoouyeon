import InventoryManager from './InventoryManager.js';
import ProductStock from './ProductStock.js';

const makeFakeStockMap = (fakeStocks) => {
  const stockMap = new Map();
  fakeStocks.forEach((fakeStock) => {
    const [productName, stockInfo] = fakeStock;
    stockMap.set(productName, new ProductStock({ name: productName, ...stockInfo }));
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
      { productName: '사이다', quantity: 8 },
      { productName: '오렌지주스', quantity: 9 },
      { productName: '콜라', quantity: 10 },
      { productName: '콜라', quantity: 20 },
    ])(
      '재고가 충분한 상품은 에러 대신 해당하는 ProductStock 객체를 반환한다.',
      ({ productName, quantity }) => {
        // given
        const inventoryManager = new InventoryManager(PRODUCT_DATA);

        // when
        const purchaseResponse = inventoryManager.checkInventory(productName, quantity);

        // then
        expect(purchaseResponse).toBeInstanceOf(ProductStock);
        expect(purchaseResponse).toBe(inventoryManager.currentInventory.get(productName));
        expect(purchaseResponse.totalQuantity).toBeGreaterThanOrEqual(quantity);
      }
    );
  });

  describe('재고 차감 테스트', () => {
    test('프로모션 상품 재고를 차감하고 재고 정보를 업데이트한다.', () => {
      // given
      const EXPECTED_STOCK_MAP = makeFakeStockMap([
        [
          '콜라',
          {
            normal: { price: 1000, quantity: 10 },
            promotion: { price: 1000, quantity: 5, promotion: '탄산2+1' },
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
      const PROMOTION_PRODUCT = '콜라';
      const PURCHASE_QUANTITY = 5;
      const inventoryManager = new InventoryManager(PRODUCT_DATA);

      // when
      inventoryManager.decreaseStock(PROMOTION_PRODUCT, PURCHASE_QUANTITY, true);

      // then
      expect(inventoryManager.currentInventory).toEqual(EXPECTED_STOCK_MAP);
    });

    test('일반 상품 재고를 차감하고 재고 정보를 업데이트한다.', () => {
      // given
      const EXPECTED_STOCK_MAP = makeFakeStockMap([
        [
          '콜라',
          {
            normal: { price: 1000, quantity: 5 },
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
      const NORMAL_PRODUCT = '콜라';
      const PURCHASE_QUANTITY = 5;
      const inventoryManager = new InventoryManager(PRODUCT_DATA);

      // when
      inventoryManager.decreaseStock(NORMAL_PRODUCT, PURCHASE_QUANTITY, false);

      // then
      expect(inventoryManager.currentInventory).toEqual(EXPECTED_STOCK_MAP);
    });
  });
});
