import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const array = [10, 20, 30, 40, 50];

  test('should generate linked list from values 1', () => {
    const linkedList = {
      value: 10,
      next: {
        value: 20,
        next: {
          value: 30,
          next: {
            value: 40,
            next: {
              value: 50,
              next: {
                value: null,
                next: null,
              },
            },
          },
        },
      },
    };
    expect(generateLinkedList(array)).toStrictEqual(linkedList);
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(array)).toMatchSnapshot();
  });
});
