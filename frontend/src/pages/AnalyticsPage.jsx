import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Package,
  Weight,
  CheckCircle2,
  Truck,
  XCircle,
  Clock,
  Globe2,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { StatCard } from '../components/StatCard';

export function AnalyticsPage({ shipments = [], stats, activePage, onNavigate }) {
  const total = stats.total || 0;
  
  const deliveredPct = total > 0 ? ((stats.delivered / total) * 100).toFixed(1) : '0.0';
  const transitPct = total > 0 ? ((stats.inTransit / total) * 100).toFixed(1) : '0.0';
  const createdPct = total > 0 ? ((stats.created / total) * 100).toFixed(1) : '0.0';
  const cancelledPct = total > 0 ? ((stats.cancelled / total) * 100).toFixed(1) : '0.0';

  const totalRevenue = useMemo(() => {
    return shipments.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
  }, [shipments]);

  const totalWeight = useMemo(() => {
    return shipments.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
  }, [shipments]);

  const avgCost = total > 0 ? (totalRevenue / total).toFixed(2) : '0.00';

  // Group shipments by corridor routes for real analytics
  const corridorSummary = useMemo(() => {
    const map = {};
    shipments.forEach((s) => {
      const route = `${s.source} → ${s.destination}`;
      if (!map[route]) {
        map[route] = { route, count: 0, weight: 0, revenue: 0 };
      }
      map[route].count += 1;
      map[route].weight += Number(s.weight) || 0;
      map[route].revenue += Number(s.cost) || 0;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [shipments]);

  return (
    <div className="page-layout-sidebar">
      
      {/* Workspace Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Analytics Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Analytics &amp; Intelligence
            </h1>
            <p className="page-subtitle">
              Operational metrics, corridor distribution, and cargo telemetry derived strictly from live records.
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
            <span>Database Aggregates</span>
          </div>
        </div>

        {/* 4 KPI Cards - Zero Fake Trends */}
        <div className="kpi-grid">
          <StatCard
            title="Total Shipments"
            value={stats.total}
            iconType="total"
            subtitle="Registered packages"
          />
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            iconType="transit"
            subtitle="Active corridors"
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            iconType="delivered"
            subtitle="Completed drop-offs"
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            iconType="cancelled"
            subtitle="Terminated shipments"
          />
        </div>

        {/* Center Grid: Freight Financials + Status Distribution */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 1fr',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          
          {/* Freight Financials & Cargo Card */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                Financial &amp; Cargo Freight Overview
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Key commercial metrics computed directly from database records.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <DollarSign style={{ width: '14px', height: '14px', color: '#059669' }} />
                    <span>Total Freight Value</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '6px' }}>
                    ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Gross billed tariff
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <Weight style={{ width: '14px', height: '14px', color: '#2563eb' }} />
                    <span>Total Cargo Payload</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '6px' }}>
                    {totalWeight.toFixed(1)} <span style={{ fontSize: '0.875rem' }}>kg</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Cumulative weight logged
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <TrendingUp style={{ width: '14px', height: '14px', color: '#6366f1' }} />
                    <span>Average Package Tariff</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '6px' }}>
                    ${avgCost}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Average per consignment
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} />
                    <span>Delivery Success Rate</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669', marginTop: '6px' }}>
                    {deliveredPct}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Completed drop-offs
                  </div>
                </div>

              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-card)', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Real-time aggregation from Supabase database</span>
              <span className="font-mono">Total {shipments.length} Records</span>
            </div>
          </div>

          {/* Status Distribution Donut Card */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                Status Distribution
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Active lifecycle phase breakdown
              </p>

              {/* Donut Graphic */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '12px 0' }}>
                <svg style={{ width: '140px', height: '140px' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  
                  {/* Delivered segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="238.7"
                    strokeDashoffset={238.7 * (1 - (parseFloat(deliveredPct) || 0) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  
                  {/* In Transit segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="12"
                    strokeDasharray="238.7"
                    strokeDashoffset={238.7 * (1 - (parseFloat(transitPct) || 0) / 100)}
                    strokeLinecap="round"
                    transform="rotate(60 50 50)"
                  />
                </svg>

                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="font-display font-mono" style={{ fontSize: '1.375rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {total}
                  </span>
                  <span style={{ fontSize: '0.625rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8' }}>
                    Total
                  </span>
                </div>
              </div>

              {/* Status Percentages Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Delivered</span>
                  </div>
                  <span className="font-mono" style={{ fontWeight: '700' }}>{stats.delivered} ({deliveredPct}%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>In Transit</span>
                  </div>
                  <span className="font-mono" style={{ fontWeight: '700' }}>{stats.inTransit} ({transitPct}%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Created</span>
                  </div>
                  <span className="font-mono" style={{ fontWeight: '700' }}>{stats.created} ({createdPct}%)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Cancelled</span>
                  </div>
                  <span className="font-mono" style={{ fontWeight: '700' }}>{stats.cancelled} ({cancelledPct}%)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Lower Section: Active Logistics Corridors Distribution */}
        <div className="card-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Corridor Route Analysis
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Active shipment corridors grouped by origin and destination pairs.
              </p>
            </div>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>
              {corridorSummary.length} Unique Corridors
            </span>
          </div>

          {corridorSummary.length === 0 ? (
            <div style={{ padding: '36px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              No corridor data recorded yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {corridorSummary.map((c) => (
                <div key={c.route} style={{ padding: '14px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                    {c.route}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{c.count} Consignments</span>
                    <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>${c.revenue.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    Total Payload: {c.weight.toFixed(1)} kg
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
