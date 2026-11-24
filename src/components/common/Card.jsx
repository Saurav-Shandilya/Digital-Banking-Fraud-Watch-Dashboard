import React from 'react';

export const Card = ({ children, title, subtitle, className = '', style = {} }) => (
  <div className={`glass-card ${className}`} style={style}>
    {title && (
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);
