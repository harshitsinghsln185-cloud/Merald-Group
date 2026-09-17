import React from 'react';
import type { EmployeeStatus } from '../../types';

interface BadgeProps {
  status: EmployeeStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const norm = status.toUpperCase();

  if (norm === 'ACTIVE') {
    return <span className="badge-active">ACTIVE</span>;
  }
  if (norm === 'LEAVE') {
    return <span className="badge-leave">ON LEAVE</span>;
  }
  return <span className="badge-inactive">INACTIVE</span>;
};
