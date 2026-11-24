import React, { useState } from 'react';
import { useFraudEngine } from '../../context/FraudEngineContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { updateRulesConfig, resetRulesConfig } from '../../services/fraudEngine/thresholdConfig';
import initialRules from '../../data/defaultRules.json';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  IndianRupee, 
  Activity, 
  Globe, 
  Lock 
} from 'lucide-react';

export const FraudWatchRules = () => {
  const { rules, updateRuleConfig } = useFraudEngine();
  const [formData, setFormData] = useState({ ...rules });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWeightChange = (weightKey, value) => {
    setFormData(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [weightKey]: parseInt(value) || 0
      }
    }));
  };

  const handleThresholdChange = (threshKey, value) => {
    setFormData(prev => ({
      ...prev,
      riskThresholds: {
        ...prev.riskThresholds,
        [threshKey]: parseInt(value) || 0
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateRuleConfig(formData);
    updateRulesConfig(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    const defaultData = resetRulesConfig();
    setFormData(defaultData);
    updateRuleConfig(defaultData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Fraud-Watch Rules & Weights
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Tune the risk scoring heuristics, policy limits, and anomaly weights.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={handleReset}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RotateCcw size={16} />
              <span>Reset Defaults</span>
            </div>
          </Button>
          <Button onClick={handleSave}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} />
              <span>Save Rules</span>
            </div>
          </Button>
        </div>
      </div>

      {savedNotice && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--accent-success)',
          color: 'var(--accent-success)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem'
        }}>
          <Check size={18} />
          <span>Rules configuration updated and applied to active fraud engine!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Limits & Thresholds Card */}
        <Card title="Threshold Limits" subtitle="Hard and warning caps for single and velocity events">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Max Single Transaction Cap (₹)
              </label>
              <input
                type="number"
                value={formData.maxSingleTransactionLimit}
                onChange={(e) => handleInputChange('maxSingleTransactionLimit', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                Transactions exceeding this incur a 1.5x penalty multiplier.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                High-Risk Warning Amount (₹)
              </label>
              <input
                type="number"
                value={formData.highRiskAmountThreshold}
                onChange={(e) => handleInputChange('highRiskAmountThreshold', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                Amounts above this trigger initial amount violation score.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Velocity Frequency Limit (Transactions per hour)
              </label>
              <input
                type="number"
                value={formData.velocityFrequencyLimitPerHr}
                onChange={(e) => handleInputChange('velocityFrequencyLimitPerHr', parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                Velocity spike penalty applies when user exceeds this frequency in past 60 min.
              </span>
            </div>
          </div>
        </Card>

        {/* Scoring Weights */}
        <Card title="Penalty Scoring Weights" subtitle="Contribution score (0 - 100) added for each triggered violation">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { key: 'locationMismatch', label: 'Location Anomaly / Foreign Origin', desc: 'Added when location does not match allowed home locales' },
              { key: 'amountViolation', label: 'Amount Cap Exceeded', desc: 'Added when amount exceeds configured threshold' },
              { key: 'frequencySpike', label: 'Velocity Frequency Burst', desc: 'Added when transaction rate exceeds velocity threshold' },
              { key: 'highRiskCategory', label: 'High-Risk Merchant Category', desc: 'Added for Crypto, International Wires, Gambling, etc.' }
            ].map((weight) => (
              <div key={weight.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{weight.label}</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    +{formData.weights?.[weight.key]} pts
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={formData.weights?.[weight.key] || 0}
                  onChange={(e) => handleWeightChange(weight.key, e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{weight.desc}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category & Location Whitelist */}
        <Card title="Restricted Entities & Locations" subtitle="Managed lists for location and high risk categorizations">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                Allowed Home Locations
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.allowedHomeLocations?.map((loc, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: 'var(--accent-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                High-Risk Merchant Categories
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.highRiskCategories?.map((cat, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--accent-danger)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: '12px',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <strong>Risk Level Classification Tiers:</strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '8px', textAlign: 'center' }}>
                <div style={{ color: 'var(--risk-low)' }}>Low &lt; {formData.riskThresholds?.low}</div>
                <div style={{ color: 'var(--risk-medium)' }}>Med &lt; {formData.riskThresholds?.medium}</div>
                <div style={{ color: 'var(--risk-high)' }}>High &lt; {formData.riskThresholds?.high}</div>
                <div style={{ color: 'var(--risk-critical)' }}>Critical &ge; {formData.riskThresholds?.high}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
