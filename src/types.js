/**
 * @typedef {Object} SingleProductRawDataType - csv 파일에서 읽어온 개별 상품 정보
 * @property {string} name - 상품명
 * @property {string} price - 가격
 * @property {string} quantity - 수량
 * @property {string} promotion - 프로모션 정보
 */

/**
 * @typedef {Array<SingleProductRawDataType>} ProductRawDataType - csv 파일에서 읽어온 상품 정보 배열
 */

/**
 * @typedef {Object} ProductStockInfoType - 재고 정보 (일반 재고 또는 프로모션 재고)
 * @property {number} price - 가격
 * @property {number} quantity - 수량
 * @property {string=} promotion - 프로모션 정보
 */

/**
 * @typedef {Object} SingleProductStockType - 개별 상품 재고 정보
 * @property {ProductStockInfoType=} normal - 일반 상품 정보
 * @property {ProductStockInfoType=} promotion - 프로모션 상품 정보
 */

/**
 * @typedef {Map<string, SingleProductStockType>} ProductStockType - 상품명을 key로 가지는 전체 상품 재고 정보
 */

/**
 * @typedef {Object} PurchaseResponseType - 구매 요청에 대한 응답
 * @property {boolean} isAvailable - 상품 구매 가능 여부
 * @property {ProductStockInfoType=} normal - 일반 상품 수량 (구매 가능할 경우)
 * @property {ProductStockInfoType=} promotion - 프로모션 상품 수량 (구매 가능할 경우)
 */

export {};
