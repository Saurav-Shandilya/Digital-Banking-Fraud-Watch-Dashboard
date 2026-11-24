/**
 * Configurable Thresholds for Fraud Scoring Engine
 * Lead: Saumya Raghav (Roll No: 2415001444)
 */
import initialRules from '../../data/defaultRules.json';

let currentRules = { ...initialRules };

export const getRulesConfig = () => ({ ...currentRules });

export const updateRulesConfig = (newRules) => {
  currentRules = { ...currentRules, ...newRules };
  return currentRules;
};

export const resetRulesConfig = () => {
  currentRules = { ...initialRules };
  return currentRules;
};
