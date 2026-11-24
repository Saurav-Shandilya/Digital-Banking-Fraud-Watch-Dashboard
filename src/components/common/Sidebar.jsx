import React from 'react';
import { LayoutDashboard, ArrowLeftRight, ShieldAlert, BarChart3, Settings } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Account Overview', icon: LayoutDashboard },
    { id: 'transfer', label: 'Fund Transfer', icon: ArrowLeftRight },
    { id: 'fraud-watch', label: 'Fraud-Watch Rules', icon: ShieldAlert },
    { id: 'statements', label: 'Statements & Analytics', icon: BarChart3 }
  ];

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid var(--border-color)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {menuItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isActive ? 'var(--accent-primary)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: isActive ? 600 : 400,
              transition: 'all var(--transition-fast)'
            }}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </aside>
  );
};
