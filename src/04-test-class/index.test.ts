// Uncomment the code below and write your tests
import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  const INITIAL_BALANCE = 100500;
  let account: BankAccount;

  beforeEach(() => {
    account = getBankAccount(INITIAL_BALANCE);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(INITIAL_BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const amount = 100600;
    expect(() => account.withdraw(amount)).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const newAccount = getBankAccount(500100);
    const amount = 100600;
    expect(() => account.transfer(amount, newAccount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const amount = 100600;
    expect(() => account.transfer(amount, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const amount = 100300;
    account.deposit(amount);
    expect(account.getBalance()).toEqual(200800);
  });

  test('should withdraw money', () => {
    const amount = 100300;
    account.withdraw(amount);
    expect(account.getBalance()).toEqual(200);
  });

  test('should transfer money', () => {
    const newAccount = getBankAccount(500100);
    const amount = 100;
    account.transfer(amount, newAccount);
    expect(newAccount.getBalance()).toEqual(500200);
    expect(account.getBalance()).toEqual(100400);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const mockFetchBalance = jest.fn().mockResolvedValue(500);
    account.fetchBalance = mockFetchBalance;
    const balance = await account.fetchBalance();
    expect(balance).toBe(500);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const mockFetchBalance = jest.fn().mockResolvedValue(500);
    account.fetchBalance = mockFetchBalance;
    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(500);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const mockFetchBalance = jest.fn().mockResolvedValue(null);
    account.fetchBalance = mockFetchBalance;

    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
