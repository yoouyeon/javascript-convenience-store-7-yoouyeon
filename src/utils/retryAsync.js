import { Console } from '@woowacourse/mission-utils';

const retryAsync = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    Console.print(error.message);
    return retryAsync(fn);
  }
};

export default retryAsync;
