import React from 'react';
import { useAccount } from '../../context/AccountContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  prepareRiskDistributionData, 
  prepareCategorySpendingData 
} from '../../services/visualizationService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { BarChart3, PieChart, ShieldAlert, TrendingDown, IndianRupee } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const StatementsAnalytics = () => {
  const { transactions } = useAccount();

  const riskData = prepareRiskDistributionData(transactions);
  const spendingData = prepareCategorySpendingData(transactions);

  // Financial aggregates
  const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const flaggedVolume = transactions
    .filter(t => t.status === 'Flagged')
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const safeVolume = totalVolume - flaggedVolume;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          font: { family: 'Plus Jakarta Sans', size: 12 }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Statements & Risk Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Visual telemetry, category spending patterns, and risk exposure breakdown.
        </p>
      </div>

      {/* Financial Exposure KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <Card>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Total Transaction Throughput
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px' }}>
            {formatCurrency(totalVolume)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Across {transactions.length} total operations
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Approved Clean Flow
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-success)', marginTop: '8px' }}>
            {formatCurrency(safeVolume)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {totalVolume > 0 ? ((safeVolume / totalVolume) * 100).toFixed(1) : 100}% of gross volume
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Flagged & At-Risk Capital
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-danger)', marginTop: '8px' }}>
            {formatCurrency(flaggedVolume)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {totalVolume > 0 ? ((flaggedVolume / totalVolume) * 100).toFixed(1) : 0}% potential fraud intercepted
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Risk Distribution Doughnut */}
        <Card title="Risk Classification Distribution" subtitle="Transaction density grouped by threat level">
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={riskData} options={chartOptions} />
          </div>
        </Card>

        {/* Category Spending Bar Chart */}
        <Card title="Spending by Category" subtitle="Capital allocation across merchant segments">
          <div style={{ height: '300px' }}>
            <Bar data={spendingData} options={barOptions} />
          </div>
        </Card>
      </div>

      {/* Flagged Audit Table */}
      <Card title="High-Risk Incident Log" subtitle="Comprehensive record of all transactions triggering rules">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Incident ID</th>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px' }}>Recipient</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Risk Level</th>
                <th style={{ padding: '12px 16px' }}>Triggered Violations</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(t => t.status === 'Flagged' || t.riskLevel === 'High' || t.riskLevel === 'Critical').length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No flagged security incidents recorded.
                  </td>
                </tr>
              ) : (
                transactions
                  .filter(t => t.status === 'Flagged' || t.riskLevel === 'High' || t.riskLevel === 'Critical')
                  .map(txn => (
                    <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>{txn.id}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{formatDate(txn.timestamp)}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{txn.recipient}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>{formatCurrency(txn.amount)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge level={txn.riskLevel} score={txn.riskScore} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {txn.ruleViolations?.map((v, i) => (
                            <span key={i} style={{ color: 'var(--accent-danger)', fontSize: '0.75rem' }}>
                              • {v}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
