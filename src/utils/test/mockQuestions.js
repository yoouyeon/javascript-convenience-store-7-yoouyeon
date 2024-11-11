import { Console } from '@woowacourse/mission-utils';

const mockQuestions = (inputs) => {
  const messages = [];
  Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();
    if (input === undefined) throw new Error('NO INPUT');
    return Promise.resolve(input);
  });
  Console.readLineAsync.messages = messages;
};

export default mockQuestions;
