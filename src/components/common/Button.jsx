import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', style = {}, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={variant === 'primary' ? 'btn-primary' : ''}
      style={{
        padding: '10px 18px',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
        background: variant === 'secondary' ? 'var(--bg-tertiary)' : undefined,
        color: 'var(--text-primary)',
        ...style
      }}
    >
      {children}
    </button>
  );
};
