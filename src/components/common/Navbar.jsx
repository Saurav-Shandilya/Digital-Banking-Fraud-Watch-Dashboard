import React from 'react';
import { useAccount } from '../../context/AccountContext';
import { ShieldCheck, User } from 'lucide-react';

export const Navbar = () => {
  const { account } = useAccount();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(17, 24, 39, 0.8)',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck color="var(--accent-primary)" size={28} />
        <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
          FraudWatch <span style={{ color: 'var(--accent-secondary)', fontWeight: 400 }}>Banking</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{account?.accountHolder}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{account?.accountNo}</div>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <User size={20} color="#fff" />
        </div>
      </div>
    </header>
  );
};
