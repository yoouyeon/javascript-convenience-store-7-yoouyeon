import { DateTimes } from '@woowacourse/mission-utils';

const mockNowDate = (date = null) => {
  const mockDateTimes = jest.spyOn(DateTimes, 'now');
  mockDateTimes.mockReturnValue(new Date(date));
  return mockDateTimes;
};

export default mockNowDate;
