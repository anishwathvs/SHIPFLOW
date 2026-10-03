import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || 'CREATED').toUpperCase();

  let badgeClass = 'status-badge-created';
  let label = 'Created';

  if (normalized === 'IN_TRANSIT') {
    badgeClass = 'status-badge-in_transit';
    label = 'In Transit';
  } else if (normalized === 'DELIVERED') {
    badgeClass = 'status-badge-delivered';
    label = 'Delivered';
  } else if (normalized === 'CANCELLED') {
    badgeClass = 'status-badge-cancelled';
    label = 'Cancelled';
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span className="status-badge-dot" />
      <span>{label}</span>
    </span>
  );
}
