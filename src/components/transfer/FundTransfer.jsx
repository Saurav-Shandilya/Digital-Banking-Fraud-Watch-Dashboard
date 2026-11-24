import React, { useState, useMemo } from 'react';
import { useAccount } from '../../context/AccountContext';
import { useFraudEngine } from '../../context/FraudEngineContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { evaluateTransaction } from '../../services/fraudEngine/rulesEngine';
import { validateTransferForm } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  IndianRupee, 
  MapPin, 
  Tag, 
  UserCheck 
} from 'lucide-react';

export const FundTransfer = () => {
  const { account, transactions, addTransaction } = useAccount();
  const { addFlaggedTxn } = useFraudEngine();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [location, setLocation] = useState(account?.homeLocation || 'New York, USA');
  const [formErrors, setFormErrors] = useState({});
  const [pendingTxn, setPendingTxn] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastProcessedTxn, setLastProcessedTxn] = useState(null);

  // Live real-time risk simulation as the user types
  const liveEvaluation = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) return null;

    const mockCandidate = {
      accountNo: account?.accountNo,
      amount: numAmount,
      recipient: recipient || 'Unknown Recipient',
      category,
      location,
      timestamp: new Date().toISOString()
    };

    return evaluateTransaction(mockCandidate, transactions);
  }, [amount, recipient, category, location, account, transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLastProcessedTxn(null);

    const validation = validateTransferForm({ recipient, amount }, account?.balance || 0);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    setFormErrors({});

    const txnCandidate = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      accountNo: account?.accountNo,
      amount: parseFloat(amount),
      recipient,
      category,
      location,
      ipAddress: '192.168.1.50',
      device: 'Current Browser Client'
    };

    const evaluated = evaluateTransaction(txnCandidate, transactions);

    if (evaluated.status === 'Flagged') {
      setPendingTxn(evaluated);
      setShowConfirmModal(true);
    } else {
      executeTransaction(evaluated);
    }
  };

  const executeTransaction = (txnToExecute) => {
    addTransaction(txnToExecute);
    if (txnToExecute.status === 'Flagged') {
      addFlaggedTxn(txnToExecute);
    }
    setLastProcessedTxn(txnToExecute);
    setShowConfirmModal(false);
    setPendingTxn(null);
    setRecipient('');
    setAmount('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Fund Transfer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Execute safe domestic and international wire transfers with automated heuristic fraud inspection.
        </p>
      </div>

      {lastProcessedTxn && (
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: lastProcessedTxn.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${lastProcessedTxn.status === 'Approved' ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastProcessedTxn.status === 'Approved' ? (
              <CheckCircle2 color="var(--accent-success)" size={24} />
            ) : (
              <ShieldAlert color="var(--accent-danger)" size={24} />
            )}
            <div>
              <div style={{ fontWeight: 700 }}>
                {lastProcessedTxn.status === 'Approved' ? 'Transfer Completed Successfully' : 'Transfer Flagged & Held for Audit'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {formatCurrency(lastProcessedTxn.amount)} sent to {lastProcessedTxn.recipient} • Txn ID: {lastProcessedTxn.id}
              </div>
            </div>
          </div>
          <Badge level={lastProcessedTxn.riskLevel} score={lastProcessedTxn.riskScore} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Transfer Form */}
        <Card title="Initiate Payment" subtitle="Enter transfer parameters below">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Account Balance display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Debiting From:</span>
              <span style={{ fontWeight: 600 }}>{account?.accountType} (Balance: {formatCurrency(account?.balance || 0)})</span>
            </div>

            {/* Recipient */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Recipient Name / Account
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp, Jane Doe, or Overseas Wire"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: formErrors.recipient ? '1px solid var(--accent-danger)' : '1px solid var(--border-color)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              {formErrors.recipient && (
                <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                  {formErrors.recipient}
                </span>
              )}
            </div>

            {/* Amount */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Amount (₹ INR)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: formErrors.amount ? '1px solid var(--accent-danger)' : '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              />
              {formErrors.amount && (
                <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                  {formErrors.amount}
                </span>
              )}

              {/* Quick Amount Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {[500, 2000, 5000, 15000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    +₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Transaction Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              >
                <option value="General">General Transfer</option>
                <option value="Cloud Services">Cloud Services</option>
                <option value="Electronics">Electronics</option>
                <option value="Retail">Retail & Merchant</option>
                <option value="International Wire">International Wire (High Risk)</option>
                <option value="Cryptocurrency">Cryptocurrency (High Risk)</option>
                <option value="Casino & Gambling">Casino & Gambling (High Risk)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Originating Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              >
                <option value="New York, USA">New York, USA (Home Location)</option>
                <option value="San Francisco, USA">San Francisco, USA (Home Location)</option>
                <option value="London, UK">London, UK (Foreign Location)</option>
                <option value="Lagos, Nigeria">Lagos, Nigeria (Foreign Location)</option>
                <option value="Bucharest, Romania">Bucharest, Romania (Foreign Location)</option>
                <option value="Tokyo, Japan">Tokyo, Japan (Foreign Location)</option>
              </select>
            </div>

            <Button type="submit" style={{ marginTop: '10px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Send size={18} />
                <span>Verify & Execute Payment</span>
              </div>
            </Button>
          </form>
        </Card>

        {/* Right Column: Real-Time Risk Simulation Engine Output */}
        <Card title="Live Fraud-Watch Heuristics" subtitle="Real-time pre-flight inspection of entered transaction">
          {liveEvaluation ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Calculated Risk Score</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                    {liveEvaluation.riskScore} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 100</span>
                  </div>
                </div>
                <Badge level={liveEvaluation.riskLevel} score={liveEvaluation.riskScore} />
              </div>

              {/* Progress Bar of Risk */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                  <span>Risk Spectrum</span>
                  <span>{liveEvaluation.riskLevel} Risk</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${liveEvaluation.riskScore}%`,
                    height: '100%',
                    background: liveEvaluation.riskScore < 25 ? 'var(--risk-low)' :
                                liveEvaluation.riskScore < 50 ? 'var(--risk-medium)' :
                                liveEvaluation.riskScore < 75 ? 'var(--risk-high)' : 'var(--risk-critical)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Rule Triggers List */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
                  Rule Evaluation Analysis
                </div>
                {liveEvaluation.ruleViolations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {liveEvaluation.ruleViolations.map((v, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          fontSize: '0.8rem',
                          color: 'var(--accent-danger)'
                        }}
                      >
                        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.85rem',
                    color: 'var(--accent-success)'
                  }}>
                    <ShieldCheck size={20} />
                    <span>Parameters are within standard baseline thresholds.</span>
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <strong>Tip:</strong> Try testing with an amount over <strong>₹5,000</strong>, a foreign location like <strong>Lagos, Nigeria</strong>, or category <strong>Cryptocurrency</strong> to observe the scoring model trigger.
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <Info size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>Fill in the transfer amount on the left to trigger dynamic heuristic inspection.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Flagged Alert Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Security Alert: High Risk Transaction"
      >
        {pendingTxn && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--accent-danger)',
              color: 'var(--accent-danger)'
            }}>
              <AlertTriangle size={28} />
              <div>
                <div style={{ fontWeight: 700 }}>Fraud-Watch Interception Triggered</div>
                <div style={{ fontSize: '0.85rem' }}>Risk Score: {pendingTxn.riskScore}/100 ({pendingTxn.riskLevel} Level)</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              This payment of <strong>{formatCurrency(pendingTxn.amount)}</strong> to <strong>{pendingTxn.recipient}</strong> violated one or more security policies:
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {pendingTxn.ruleViolations.map((v, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--accent-danger)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.08)'
                  }}
                >
                  • {v}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                Cancel Transaction
              </Button>
              <button
                onClick={() => executeTransaction(pendingTxn)}
                style={{
                  background: 'var(--accent-danger)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Flag & Record Transaction
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
