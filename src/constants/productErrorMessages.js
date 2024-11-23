const PRODUCT_ERROR_MESSAGES = Object.freeze({
  notExistProduct: '존재하지 않는 상품입니다. 다시 입력해 주세요.',
  invalidFormat:
    '올바르지 않은 형식으로 입력했습니다. 다시 입력해주세요. (예: [사이다-2],[감자칩-1])',
  invalidValue: '가격과 수량 정보가 숫자가 아닙니다.',
  exceedQuantity: '재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
});

export default PRODUCT_ERROR_MESSAGES;
