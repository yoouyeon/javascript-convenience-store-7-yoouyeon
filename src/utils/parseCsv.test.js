import parseCsv from './parseCsv.js';

describe('CSV 파싱 테스트', () => {
  test('CSV 데이터를 파싱한다.', () => {
    // given
    /* prettier-ignore */
    const CSV_DATA = 
`name,price,quantity,promotion
콜라,1000,10,탄산2+1
콜라,1000,10,null
사이다,1000,8,탄산2+1
사이다,1000,7,null`;

    // when
    const result = parseCsv(CSV_DATA);

    // then
    expect(result).toEqual([
      { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' },
      { name: '콜라', price: '1000', quantity: '10', promotion: 'null' },
      { name: '사이다', price: '1000', quantity: '8', promotion: '탄산2+1' },
      { name: '사이다', price: '1000', quantity: '7', promotion: 'null' },
    ]);
  });
});
