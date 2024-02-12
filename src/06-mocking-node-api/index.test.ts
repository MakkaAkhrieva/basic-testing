// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  const mockCallback = jest.fn();
  const timeout = 300;

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(mockCallback, timeout);
    expect(mockCallback).not.toBeCalled();
    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toBeCalled();
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(mockCallback, timeout);

    jest.advanceTimersByTime(timeout - 1);
    expect(mockCallback).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(mockCallback).toBeCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  const mockCallback = jest.fn();
  const timeout = 300;

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');

    doStuffByInterval(mockCallback, timeout);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(mockCallback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(timeout);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  const fileName = 'file.txt';

  test('should call join with pathToFile', async () => {
    expect.assertions(1);
    const mockedJoin = jest.spyOn(path, 'join');

    await readFileAsynchronously(fileName);

    expect(mockedJoin).toHaveBeenCalledWith(__dirname, fileName);
  });

  test('should return null if file does not exist', async () => {
    expect.assertions(1);
    (existsSync as jest.Mock).mockReturnValue(false);

    const fileContent = await readFileAsynchronously(fileName);

    expect(fileContent).toBeNull();
  });

  test('should return file content if file exists', async () => {
    expect.assertions(1);
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue('content');

    const fileContent = await readFileAsynchronously(fileName);

    expect(fileContent).toEqual('content');
  });
});
