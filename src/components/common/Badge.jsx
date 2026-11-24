import React from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export const Badge = ({ level = 'Low', score }) => {
  const levelMap = {
    Low: { class: 'badge-low', icon: CheckCircle },
    Medium: { class: 'badge-medium', icon: Info },
    High: { class: 'badge-high', icon: AlertTriangle },
    Critical: { class: 'badge-critical', icon: ShieldAlert }
  };

  const current = levelMap[level] || levelMap.Low;
  const Icon = current.icon;

  return (
    <span className={`badge ${current.class}`}>
      <Icon size={14} />
      {level} {score !== undefined && `(${score})`}
    </span>
  );
};
