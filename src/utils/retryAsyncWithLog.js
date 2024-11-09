import { Console } from '@woowacourse/mission-utils';

const retryAsyncWithLog = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    Console.print(error.message);
    return retryAsyncWithLog(fn);
  }
};

export default retryAsyncWithLog;
