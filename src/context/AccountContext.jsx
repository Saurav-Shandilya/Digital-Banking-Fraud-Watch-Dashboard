import React, { createContext, useContext, useState } from 'react';
import initialAccounts from '../data/mockAccounts.json';
import initialTransactions from '../data/transactions.json';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(initialAccounts[0]);
  const [transactions, setTransactions] = useState(initialTransactions);

  const addTransaction = (newTxn) => {
    setTransactions(prev => [newTxn, ...prev]);
    if (newTxn.status === 'Approved') {
      setAccount(prev => ({
        ...prev,
        balance: prev.balance - newTxn.amount
      }));
    }
  };

  return (
    <AccountContext.Provider value={{ account, transactions, addTransaction }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
