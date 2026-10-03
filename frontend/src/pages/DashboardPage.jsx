import React from 'react';
import { 
  Package, 
  Calendar,
  ChevronRight,
  Plus
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
  const recentShipments = shipments.slice(0, 5);

  return (
    <div className="page-layout-sidebar">
      
      {/* Left Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Dashboard Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Dashboard
            </h1>
            <p className="page-subtitle">
              Real-time overview of your global shipments.
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
              <span>Last 30 days</span>
            </div>

            <button
              onClick={() => onNavigate('create')}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span>New Shipment</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="kpi-grid">
          <StatCard
            title="Total Shipments"
            value={stats.total}
            iconType="total"
            trend="+12%"
            subtitle="Registered packages"
          />
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            iconType="transit"
            trend="+5%"
            subtitle="Active corridors"
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            iconType="delivered"
            trend="+16%"
            subtitle="Completed drop-offs"
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            iconType="cancelled"
            trend="0%"
            subtitle="Terminated"
          />
        </div>

        {/* Center Grid: 3D/Vector Route Map + Recent Shipments List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '20px',
          alignItems: 'stretch'
        }}>
          
          {/* Map Telemetry Card */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Global Route Telemetry
                </h3>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  Real-time visualization of transit corridors.
                </p>
              </div>

              <button
                onClick={() => onNavigate('map')}
                style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Full Map</span>
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            <LogisticsWorldMap shipments={shipments} height="260px" />
          </div>

          {/* Recent Shipments Card */}
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-card)', marginBottom: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Recent Shipments
                </h3>
                <button
                  onClick={() => onNavigate('shipments')}
                  style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)' }}
                >
                  View all
                </button>
              </div>

              {recentShipments.length === 0 ? (
                <div style={{ padding: '36px 0', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                  No shipments registered yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentShipments.map((s) => (
                    <div
                      key={s.shipmentId}
                      onClick={() => onSelectShipment(s)}
                      style={{
                        padding: '10px 12px',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Package style={{ width: '16px', height: '16px' }} />
                        </div>
                        <div>
                          <div className="font-mono" style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            {s.shipmentId}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {s.source} → {s.destination}
                          </div>
                        </div>
                      </div>

                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-card)', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Total {shipments.length} records in database
              </span>
              <button
                onClick={() => onNavigate('create')}
                style={{ fontWeight: '700', color: 'var(--primary-blue)' }}
              >
                + Create New
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
