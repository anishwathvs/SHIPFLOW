import React, { useMemo } from 'react';
import { 
  Package, 
  Calendar,
  ChevronRight,
  Plus,
  ArrowRight,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Weight,
  Layers,
  Activity,
  Globe2
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { LogisticsWorldMap } from '../components/LogisticsWorldMap';

export function DashboardPage({ 
  shipments = [], 
  stats, 
  activePage, 
  onNavigate, 
  onSelectShipment 
}) {
  const recentShipments = shipments.slice(0, 6);

  // Compute live aggregates from actual shipment data
  const { totalRevenue, totalWeight, avgCost, uniqueRoutes } = useMemo(() => {
    const rev = shipments.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
    const wt = shipments.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
    const avg = shipments.length > 0 ? (rev / shipments.length).toFixed(2) : '0.00';
    const routes = new Set(shipments.map((s) => `${s.source}→${s.destination}`)).size;
    return {
      totalRevenue: rev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalWeight: wt.toFixed(1),
      avgCost: avg,
      uniqueRoutes: routes
    };
  }, [shipments]);

  // Compute status breakdown percentages
  const totalCount = stats.total || 0;
  const createdPct = totalCount > 0 ? ((stats.created / totalCount) * 100).toFixed(0) : 0;
  const transitPct = totalCount > 0 ? ((stats.inTransit / totalCount) * 100).toFixed(0) : 0;
  const deliveredPct = totalCount > 0 ? ((stats.delivered / totalCount) * 100).toFixed(0) : 0;
  const cancelledPct = totalCount > 0 ? ((stats.cancelled / totalCount) * 100).toFixed(0) : 0;

  return (
    <div className="page-layout-sidebar">
      
      {/* Left Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Dashboard Workspace Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Top Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Dashboard
            </h1>
            <p className="page-subtitle">
              Real-time overview of your global shipments and active freight corridors.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              <span>Live Database View</span>
            </div>

            <button
              onClick={() => onNavigate('create')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.8125rem' }}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span>New Shipment</span>
            </button>
          </div>
        </div>

        {/* 4 Large Refined Metric KPI Cards - Zero Fake Trends */}
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

        {/* Center Main Area: Route Telemetry + Recent Shipments */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.45fr 1fr',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          
          {/* Global Route Telemetry Card */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Global Route Telemetry
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Real-time visualization of origin to destination transit corridors.
                </p>
              </div>

              <button
                onClick={() => onNavigate('map')}
                style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Interactive Map</span>
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-card)' }}>
              <LogisticsWorldMap shipments={shipments} height="320px" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-card)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                <span>{uniqueRoutes} Active Corridors Mapped</span>
              </div>
              <span>Leaflet + CartoDB Positron Engine</span>
            </div>
          </div>

          {/* Recent Shipments Card */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-card)', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Recent Shipments
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Latest consignments recorded
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('shipments')}
                  style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)' }}
                >
                  View all ({shipments.length})
                </button>
              </div>

              {recentShipments.length === 0 ? (
                <div style={{ padding: '48px 16px', textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--bg-subtle)',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                  }}>
                    <Package style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    No shipments registered yet
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '280px', margin: '4px auto 16px auto' }}>
                    Create your first consignment to start tracking global logistics telemetry.
                  </p>
                  <button
                    onClick={() => onNavigate('create')}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
                  >
                    <Plus style={{ width: '14px', height: '14px' }} />
                    <span>Create Shipment</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentShipments.map((s) => (
                    <div
                      key={s.shipmentId}
                      onClick={() => onSelectShipment(s)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: '#ffffff',
                        border: '1px solid var(--border-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#93c5fd';
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-card)';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Package style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div>
                          <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            {s.shipmentId}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {s.source} → {s.destination}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            ${Number(s.cost || 0).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>
                            {s.weight} kg
                          </div>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-card)', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Total {shipments.length} consignments in cloud storage
              </span>
              <button
                onClick={() => onNavigate('create')}
                style={{ fontWeight: '700', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>+ Register New</span>
              </button>
            </div>
          </div>

        </div>

        {/* Secondary Section: Status Distribution & Fleet Metrics (uses viewport effectively with real data) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          
          {/* Lifecycle Status Distribution */}
          <div className="card-panel">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
              Lifecycle Status Breakdown
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Proportion of consignments across current operational phases.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* In Transit */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck style={{ width: '14px', height: '14px', color: '#4338ca' }} />
                    In Transit
                  </span>
                  <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
                    {stats.inTransit} ({transitPct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#eef2ff', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${transitPct}%`, height: '100%', background: '#6366f1', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Delivered */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 style={{ width: '14px', height: '14px', color: '#059669' }} />
                    Delivered
                  </span>
                  <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
                    {stats.delivered} ({deliveredPct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#ecfdf5', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${deliveredPct}%`, height: '100%', background: '#10b981', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Created */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '14px', height: '14px', color: '#2563eb' }} />
                    Created / Pending Dispatch
                  </span>
                  <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
                    {stats.created} ({createdPct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#eff6ff', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${createdPct}%`, height: '100%', background: '#3b82f6', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Cancelled */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <XCircle style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                    Cancelled / Terminated
                  </span>
                  <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
                    {stats.cancelled} ({cancelledPct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#fef2f2', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cancelledPct}%`, height: '100%', background: '#ef4444', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Fleet & Cargo Telemetry Metrics */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                Freight &amp; Cargo Telemetry
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Aggregated statistics derived strictly from live database consignments.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                
                <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <DollarSign style={{ width: '13px', height: '13px', color: '#059669' }} />
                    <span>Total Freight Value</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                    ${totalRevenue}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <Weight style={{ width: '13px', height: '13px', color: '#2563eb' }} />
                    <span>Total Cargo Payload</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                    {totalWeight} <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>kg</span>
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <Globe2 style={{ width: '13px', height: '13px', color: '#6366f1' }} />
                    <span>Active Corridors</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                    {uniqueRoutes} <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>pairs</span>
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
                    <Activity style={{ width: '13px', height: '13px', color: '#f59e0b' }} />
                    <span>Average Tariff</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                    ${avgCost}
                  </div>
                </div>

              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-card)', marginTop: '14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Database Engine: Supabase PostgreSQL</span>
              <button
                onClick={() => onNavigate('analytics')}
                style={{ fontWeight: '700', color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Full Analytics</span>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
