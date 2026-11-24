/**
 * Account Operations & Client-Side State Helpers
 * Lead: Saurav Shandilya (Roll No: 2415001453)
 */
import mockAccountsData from '../data/mockAccounts.json';

export const getAccountDetails = (accountNo) => {
  return mockAccountsData.find(acc => acc.accountNo === accountNo) || mockAccountsData[0];
};

export const updateBalance = (accountNo, deltaAmount) => {
  const account = getAccountDetails(accountNo);
  account.balance += deltaAmount;
  return account.balance;
};
