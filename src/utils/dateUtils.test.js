import dateUtils from './dateUtils.js';

describe('날짜 유틸함수 테스트', () => {
  test('오늘 날짜를 반환한다.', () => {
    // given
    const today = new Date();

    // when
    const result = dateUtils.today();

    // then
    expect(result).toEqual(today);
  });

  describe('날짜 범위 확인 테스트', () => {
    test.each([
      {
        targetDate: new Date('2024-11-9'),
        startDate: new Date('2024-11-8'),
        endDate: new Date('2024-11-11'),
      },
      {
        targetDate: new Date('2024-11-10'),
        startDate: new Date('2024-11-8'),
        endDate: new Date('2024-11-11'),
      },
      {
        targetDate: new Date('2024-11-9'),
        startDate: new Date('2024-11-9'),
        endDate: new Date('2024-11-9'),
      },
    ])(
      '$targetDate가 $startDate와 $endDate 사이에 포함되어 있다.',
      ({ targetDate, startDate, endDate }) => {
        // when
        const isBetween = dateUtils.isBetween(targetDate, startDate, endDate);

        // then
        expect(isBetween).toBe(true);
      }
    );

    test.each([
      {
        targetDate: new Date('2024-11-8'),
        startDate: new Date('2024-11-9'),
        endDate: new Date('2024-11-11'),
      },
      {
        targetDate: new Date('2024-11-11'),
        startDate: new Date('2024-11-8'),
        endDate: new Date('2024-11-10'),
      },
    ])(
      '$targetDate가 $startDate와 $endDate 사이에 포함되어 있지 않다.',
      ({ targetDate, startDate, endDate }) => {
        // when
        const isBetween = dateUtils.isBetween(targetDate, startDate, endDate);

        // then
        expect(isBetween).toBe(false);
      }
    );
  });
});
