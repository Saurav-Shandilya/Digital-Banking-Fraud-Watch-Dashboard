import React, { createContext, useContext, useState } from 'react';
import initialRules from '../data/defaultRules.json';

const FraudEngineContext = createContext();

export const FraudEngineProvider = ({ children }) => {
  const [rules, setRules] = useState(initialRules);
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);

  const updateRuleConfig = (updatedFields) => {
    setRules(prev => ({ ...prev, ...updatedFields }));
  };

  const addFlaggedTxn = (txn) => {
    setFlaggedTransactions(prev => [txn, ...prev]);
  };

  return (
    <FraudEngineContext.Provider value={{ rules, updateRuleConfig, flaggedTransactions, addFlaggedTxn }}>
      {children}
    </FraudEngineContext.Provider>
  );
};

export const useFraudEngine = () => useContext(FraudEngineContext);
