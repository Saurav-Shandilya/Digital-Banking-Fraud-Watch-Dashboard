/**
 * Data Transformation Helpers for Chart.js / Visualizations
 * Lead: Saurabh Singh (Roll No: 2415001450)
 */

export const prepareRiskDistributionData = (transactions) => {
  const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  transactions.forEach(t => {
    if (counts[t.riskLevel] !== undefined) {
      counts[t.riskLevel]++;
    }
  });

  return {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
    datasets: [{
      data: [counts.Low, counts.Medium, counts.High, counts.Critical],
      backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444']
    }]
  };
};

export const prepareCategorySpendingData = (transactions) => {
  const categoryTotals = {};
  transactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  return {
    labels: Object.keys(categoryTotals),
    datasets: [{
      label: 'Spending (₹)',
      data: Object.values(categoryTotals),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: '#6366f1',
      borderWidth: 1
    }]
  };
};
