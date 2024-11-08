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

/**
 * @typedef {Object} RequestStockType - 재고 관련 요청 타입
 * @property {number} normal - 일반 상품 수량
 * @property {number} promotion - 프로모션 상품 수량
 */

/**
 * @typedef {Object} SinglePromotionRawDataType - csv 파일에서 읽어온 프로모션 정보
 * @property {string} name - 프로모션명
 * @property {string} buy - 구매 수량
 * @property {string} get - 증정 수량
 * @property {string} start_date - 시작일
 * @property {string} end_date - 종료일
 */

/**
 * @typedef {Array<SinglePromotionRawDataType>} PromotionRawDataType - csv 파일에서 읽어온 프로모션 정보 배열
 */

/**
 * @typedef {import('../src/service/Promotion.js').default} PromotionType - 프로모션 정보

/**
 * @typedef {Map<string, PromotionInfoType>} PromotionMapType - 프로모션명을 key로 가지는 전체 프로모션 정보
 */

/**
 * @typedef {Object} PromotionQuantityType - 프로모션 적용 수량 정보
 * @property {number} buy - 프로모션이 적용되는 정가 구매 수량
 * @property {number} get - 프로모션이 적용되는 증정 수량
 * @property {number} nonPromo - 프로모션이 적용되지 않는 수량
 * @property {number} total - 전체 구매 수량
 */

export {};
