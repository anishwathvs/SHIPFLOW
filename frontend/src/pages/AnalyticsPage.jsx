import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Package
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { StatCard } from '../components/StatCard';

export function AnalyticsPage({ shipments = [], stats, activePage, onNavigate }) {
  const total = stats.total || 1;
  const deliveredPct = ((stats.delivered / total) * 100).toFixed(1);
  const transitPct = ((stats.inTransit / total) * 100).toFixed(1);
  const createdPct = ((stats.created / total) * 100).toFixed(1);
  const cancelledPct = ((stats.cancelled / total) * 100).toFixed(1);

  const totalRevenue = shipments.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalWeight = shipments.reduce((sum, s) => sum + (s.weight || 0), 0);

  return (
    <div className="page-layout-sidebar">
      
      {/* Sidebar */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Analytics Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Analytics
            </h1>
            <p className="page-subtitle">
              Insights and operational telemetry for global shipment corridors.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            background: '#ffffff',
            border: '1px solid var(--border-card)',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: 'var(--text-body)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <Calendar style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
            <span>Last 30 days</span>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="kpi-grid">
          <StatCard
            title="Total Shipments"
            value={stats.total}
            iconType="total"
            trend="+12%"
            subtitle="Consignments logged"
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            iconType="delivered"
            trend="+16%"
            subtitle="Successful drop-offs"
          />
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            iconType="transit"
            trend="+3%"
            subtitle="Active corridors"
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            iconType="cancelled"
            trend="-2%"
            subtitle="Terminated"
          />
        </div>

        {/* Center Grid: Trend Curve + Donut Chart */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '20px',
          alignItems: 'stretch'
        }}>
          
          {/* Trend Chart Card */}
          <div className="card-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Shipment Volume Trend
                </h3>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  Monthly dispatch volume distribution
                </p>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#2563eb',
                background: '#eff6ff',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingUp style={{ width: '13px', height: '13px' }} />
                <span>+24% Growth</span>
              </span>
            </div>

            {/* SVG Volume Curve */}
            <div style={{ width: '100%', height: '180px', position: 'relative' }}>
              <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                <path
                  d="M 0 130 C 70 120, 120 70, 180 80 C 240 90, 300 30, 380 40 C 440 50, 480 20, 500 25 L 500 150 L 0 150 Z"
                  fill="url(#curveGradient)"
                />

                <path
                  d="M 0 130 C 70 120, 120 70, 180 80 C 240 90, 300 30, 380 40 C 440 50, 480 20, 500 25"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle cx="500" cy="25" r="5" fill="#2563eb" />
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', fontWeight: '700', color: '#94a3b8', marginTop: '6px' }}>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
              </div>
            </div>
          </div>

          {/* Donut Chart Card */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '2px' }}>
                Status Distribution
              </h3>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Active lifecycle phase breakdown
              </p>

              {/* Donut Ring */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '14px 0' }}>
                <svg style={{ width: '130px', height: '130px' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (parseFloat(deliveredPct) || 50) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (parseFloat(transitPct) || 25) / 100)}
                    strokeLinecap="round"
                    transform="rotate(60 50 50)"
                  />
                </svg>

                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="font-display font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {stats.total}
                  </span>
                  <span style={{ fontSize: '0.625rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8' }}>
                    Total
                  </span>
                </div>
              </div>

              {/* Status Percentages Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', marginTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ color: 'var(--text-body)' }}>Delivered</span>
                  </div>
                  <strong className="font-mono">{deliveredPct}%</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                    <span style={{ color: 'var(--text-body)' }}>In Transit</span>
                  </div>
                  <strong className="font-mono">{transitPct}%</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                    <span style={{ color: 'var(--text-body)' }}>Created</span>
                  </div>
                  <strong className="font-mono">{createdPct}%</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ color: 'var(--text-body)' }}>Cancelled</span>
                  </div>
                  <strong className="font-mono">{cancelledPct}%</strong>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Financial & Weight Tonnage Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Cumulative Freight Revenue</span>
              <div className="font-display font-mono" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                ₹{totalRevenue.toFixed(2)}
              </div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginTop: '2px' }}>Calculated across all registered packages</p>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #a7f3d0' }}>
              <DollarSign style={{ width: '22px', height: '22px' }} />
            </div>
          </div>

          <div className="card-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Total Cargo Payload</span>
              <div className="font-display font-mono" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                {totalWeight.toFixed(1)} kg
              </div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginTop: '2px' }}>Aggregated package tonnage capacity</p>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bfdbfe' }}>
              <Package style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
