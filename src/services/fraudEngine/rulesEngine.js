/**
 * Fraud-Watch Client-Side Rules Scoring Engine (Vanilla JS)
 * Lead Developer: Saumya Raghav (Roll No: 2415001444)
 * Evaluates amount, frequency velocity, location mismatch, and category rules.
 */

import { calculateRiskLevel } from './riskCalculator.js';
import { getRulesConfig } from './thresholdConfig.js';

export const evaluateTransaction = (transaction, recentHistory = []) => {
  const config = getRulesConfig();
  const violations = [];
  let score = 0;

  // Rule 1: High Transaction Amount Check
  if (transaction.amount > config.maxSingleTransactionLimit) {
    score += config.weights.amountViolation * 1.5;
    violations.push(`Transaction amount (₹${transaction.amount}) exceeds max single limit (₹${config.maxSingleTransactionLimit})`);
  } else if (transaction.amount > config.highRiskAmountThreshold) {
    score += config.weights.amountViolation;
    violations.push(`High transaction amount (₹${transaction.amount}) exceeds warning threshold (₹${config.highRiskAmountThreshold})`);
  }

  // Rule 2: Location Mismatch Check
  const isHomeLoc = config.allowedHomeLocations.includes(transaction.location);
  if (!isHomeLoc) {
    score += config.weights.locationMismatch;
    violations.push(`Unrecognized transaction location: ${transaction.location}`);
  }

  // Rule 3: Velocity & Frequency Check
  const pastOneHourTxns = recentHistory.filter(t => {
    const diffMins = (new Date(transaction.timestamp || Date.now()) - new Date(t.timestamp)) / (1000 * 60);
    return diffMins <= 60;
  });

  if (pastOneHourTxns.length >= config.velocityFrequencyLimitPerHr) {
    score += config.weights.frequencySpike;
    violations.push(`High transaction velocity (${pastOneHourTxns.length} txns in past 60m)`);
  }

  // Rule 4: High-Risk Category Check
  if (config.highRiskCategories.includes(transaction.category)) {
    score += config.weights.highRiskCategory;
    violations.push(`High-risk merchant category: ${transaction.category}`);
  }

  // Cap max score at 100
  const finalScore = Math.min(100, Math.round(score));
  const riskInfo = calculateRiskLevel(finalScore, config.riskThresholds);

  return {
    id: transaction.id || `TXN-${Date.now()}`,
    timestamp: transaction.timestamp || new Date().toISOString(),
    accountNo: transaction.accountNo,
    amount: parseFloat(transaction.amount),
    recipient: transaction.recipient,
    category: transaction.category || 'General',
    location: transaction.location || 'Unknown',
    riskScore: finalScore,
    riskLevel: riskInfo.level,
    badgeClass: riskInfo.class,
    status: finalScore >= config.riskThresholds.high ? 'Flagged' : 'Approved',
    ruleViolations: violations
  };
};
