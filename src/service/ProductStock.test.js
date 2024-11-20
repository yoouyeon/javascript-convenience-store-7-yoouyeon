import ProductStock from './ProductStock.js';

describe('상품별 재고 관리 테스트', () => {
  describe('재고 설정 테스트', () => {
    test.each([
      {
        name: '일반 상품 데이터',
        data: { name: '사이다', price: '1000', quantity: '10', promotion: 'null' },
        expected: { price: 1000, totalQuantity: 10, promoName: '' },
      },
      {
        name: '프로모션 상품 데이터',
        data: { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' },
        expected: { price: 1000, totalQuantity: 10, promoName: '탄산2+1' },
      },
    ])('$name로 재고 객체를 생성한다.', ({ data, expected }) => {
      // given
      const productStock = new ProductStock(data);

      // then
      expect(productStock).toBeInstanceOf(ProductStock);
      expect(productStock.price).toBe(expected.price);
      expect(productStock.totalQuantity).toBe(expected.totalQuantity);
      expect(productStock.promoName).toBe(expected.promoName);
    });

    test.each([
      {
        name: '일반 상품 데이터만 설정하는 경우',
        initial: { name: '사이다', price: '9999', quantity: '9999', promotion: 'null' },
        data: { name: '사이다', price: '1000', quantity: '10', promotion: 'null' },
        expected: { price: 1000, totalQuantity: 10, promoName: '' },
      },
      {
        name: '설정된 프로모션 데이터에 일반 상품 데이터를 추가로 설정하는 경우',
        initial: { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' },
        data: { name: '콜라', price: '1000', quantity: '5', promotion: 'null' },
        expected: { price: 1000, totalQuantity: 15, promoName: '탄산2+1' },
      },
    ])('$name에 재고 정보가 알맞게 설정된다.', ({ initial, data, expected }) => {
      // given
      const productStock = new ProductStock(initial);
      productStock.setStockInfo(data);

      // then
      expect(productStock.price).toBe(expected.price);
      expect(productStock.totalQuantity).toBe(expected.totalQuantity);
      expect(productStock.promoName).toBe(expected.promoName);
    });
  });

  describe('재고 차감 테스트', () => {
    let productStock;
    const PROMOTION_DATA = { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' };
    const NORMAL_DATA = { name: '콜라', price: '1000', quantity: '5', promotion: 'null' };

    beforeEach(() => {
      productStock = new ProductStock(PROMOTION_DATA);
      productStock.setStockInfo(NORMAL_DATA);
    });

    test.each([
      { name: '프로모션 재고가 충분한 경우', decrease: 2, expected: { promotion: 8, normal: 5 } },
      { name: '프로모션 재고가 부족한 경우', decrease: 13, expected: { promotion: 0, normal: 2 } },
    ])('프로모션 중일때는 프로모션 재고를 우선 차감한다.: $name', ({ decrease, expected }) => {
      // when
      productStock.decreaseStock(decrease, true);

      // then
      expect(productStock.promotionQuantity).toBe(expected.promotion);
      expect(productStock.normalQuantity).toBe(expected.normal);
    });

    test.each([
      { name: '일반 재고가 충분한 경우', decrease: 2, expected: { promotion: 10, normal: 3 } },
      { name: '일반 재고가 부족한 경우', decrease: 13, expected: { promotion: 2, normal: 0 } },
    ])('프로모션 중이 아닌 경우 일반 재고를 우선 차감한다.: $name', ({ decrease, expected }) => {
      // when
      productStock.decreaseStock(decrease, false);

      // then
      expect(productStock.promotionQuantity).toBe(expected.promotion);
      expect(productStock.normalQuantity).toBe(expected.normal);
    });
  });
});
