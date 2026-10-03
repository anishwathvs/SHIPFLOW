import React from 'react';
import { Package, Truck, CheckCircle2, XCircle } from 'lucide-react';

export function StatCard({ title, value, iconType, trend, subtitle }) {
  const getIcon = () => {
    switch (iconType) {
      case 'transit':
        return <Truck style={{ width: '20px', height: '20px' }} />;
      case 'delivered':
        return <CheckCircle2 style={{ width: '20px', height: '20px' }} />;
      case 'cancelled':
        return <XCircle style={{ width: '20px', height: '20px' }} />;
      case 'total':
      default:
        return <Package style={{ width: '20px', height: '20px' }} />;
    }
  };

  const getIconClass = () => {
    switch (iconType) {
      case 'transit': return 'kpi-icon-violet';
      case 'delivered': return 'kpi-icon-green';
      case 'cancelled': return 'kpi-icon-red';
      case 'total':
      default: return 'kpi-icon-blue';
    }
  };

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className={`kpi-icon-box ${getIconClass()}`}>
          {getIcon()}
        </div>
        {trend && (
          <span className="kpi-trend-pill">
            {trend}
          </span>
        )}
      </div>

      <div>
        <div className="kpi-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="kpi-label">
          {title}
        </div>
        {subtitle && (
          <div className="kpi-subtext">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
