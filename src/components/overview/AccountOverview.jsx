import React, { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatCurrency, formatDate, maskAccountNo } from '../../utils/formatters';
import { 
  Wallet, 
  ArrowUpRight, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Eye, 
  AlertTriangle,
  Activity,
  Layers
} from 'lucide-react';

export const AccountOverview = ({ onNavigateToTransfer }) => {
  const { account, transactions } = useAccount();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Stats calculation
  const approvedCount = transactions.filter(t => t.status === 'Approved').length;
  const flaggedCount = transactions.filter(t => t.status === 'Flagged').length;
  const avgRiskScore = transactions.length 
    ? Math.round(transactions.reduce((acc, t) => acc + (t.riskScore || 0), 0) / transactions.length) 
    : 0;

  // Filter & Search logic
  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'ALL' || t.status === filter;
    const matchesSearch = 
      t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Account Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Real-time fraud surveillance and balance management for <span style={{ color: 'var(--accent-secondary)' }}>{account?.accountHolder}</span>
          </p>
        </div>
        {onNavigateToTransfer && (
          <Button onClick={onNavigateToTransfer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpRight size={18} />
              <span>Send Money</span>
            </div>
          </Button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1: Balance */}
        <Card style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Available Balance</p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
                {formatCurrency(account?.balance || 0)}
              </h2>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)'
            }}>
              <Wallet size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>{account?.accountType}</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{maskAccountNo(account?.accountNo)}</span>
          </div>
        </Card>

        {/* Card 2: Approved Transactions */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Cleared Transactions</p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px', color: 'var(--accent-success)' }}>
                {approvedCount}
              </h2>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-success)'
            }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Safe transfers processed successfully
          </div>
        </Card>

        {/* Card 3: Flagged Transactions */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Suspicious & Flagged</p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px', color: 'var(--accent-danger)' }}>
                {flaggedCount}
              </h2>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--accent-danger)'
            }}>
              <ShieldAlert size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Blocked or intercepted by rules
          </div>
        </Card>

        {/* Card 4: Average Risk Score */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Average Risk Index</p>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px', color: avgRiskScore > 50 ? 'var(--accent-warning)' : 'var(--accent-secondary)' }}>
                {avgRiskScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ 100</span>
              </h2>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-secondary)'
            }}>
              <Activity size={24} />
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Calculated across {transactions.length} activities
          </div>
        </Card>
      </div>

      {/* Transactions Section */}
      <Card title="Activity & Surveillance Feed" subtitle="Real-time transaction log with automated fraud scoring">
        {/* Controls: Search and Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            flex: '1',
            maxWidth: '380px'
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search by recipient, category, location, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'Approved', 'Flagged', 'Under Review'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid var(--border-color)',
                  background: filter === status ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: filter === status ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {status === 'ALL' ? 'All Transactions' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Txn ID</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Recipient & Category</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Risk Assessment</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No transactions match your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      {txn.id}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {formatDate(txn.timestamp)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{txn.recipient}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{txn.category}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {txn.location}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                      {formatCurrency(txn.amount)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge level={txn.riskLevel} score={txn.riskScore} />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: txn.status === 'Approved' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                        color: txn.status === 'Approved' ? 'var(--accent-success)' : 'var(--accent-danger)'
                      }}>
                        {txn.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        title="Inspect Risk Breakdown"
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={14} />
                        <span style={{ fontSize: '0.75rem' }}>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Details & Audit Modal */}
      <Modal
        isOpen={Boolean(selectedTxn)}
        onClose={() => setSelectedTxn(null)}
        title="Transaction Security Audit"
      >
        {selectedTxn && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{formatCurrency(selectedTxn.amount)}</div>
              </div>
              <Badge level={selectedTxn.riskLevel} score={selectedTxn.riskScore} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Recipient</span>
                <strong>{selectedTxn.recipient}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Category</span>
                <strong>{selectedTxn.category}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Location</span>
                <strong>{selectedTxn.location}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Timestamp</span>
                <span>{formatDate(selectedTxn.timestamp)}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>IP Address</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedTxn.ipAddress || '127.0.0.1 (Local)'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Device</span>
                <span>{selectedTxn.device || 'Verified Browser Session'}</span>
              </div>
            </div>

            {/* Rule Violations Section */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Rule Violations & Trigger Log
              </h4>
              {selectedTxn.ruleViolations && selectedTxn.ruleViolations.length > 0 ? (
                <ul style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {selectedTxn.ruleViolations.map((violation, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--accent-danger)',
                        fontSize: '0.8rem'
                      }}
                    >
                      <AlertTriangle size={15} />
                      <span>{violation}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-success)',
                  fontSize: '0.8rem'
                }}>
                  <ShieldCheck size={16} />
                  <span>No security rules were violated. Transaction scored within safe baseline.</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setSelectedTxn(null)}>
                Close Audit View
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
