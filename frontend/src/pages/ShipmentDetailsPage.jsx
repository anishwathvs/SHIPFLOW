import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Edit3,
  Plane,
  AlertCircle,
  CheckCircle2,
  Truck,
  Clock
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { StatusBadge } from '../components/StatusBadge';

export function ShipmentDetailsPage({ 
  shipment, 
  activePage, 
  onNavigate, 
  onOpenStatusModal 
}) {
  const [activeTab, setActiveTab] = useState('tracking');

  if (!shipment) {
    return (
      <div className="page-layout-sidebar">
        <SidebarNav activePage={activePage} onNavigate={onNavigate} />
        <div className="card-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <AlertCircle style={{ width: '32px', height: '32px', color: '#94a3b8', margin: '0 auto 12px auto' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>No shipment selected</h2>
          <button
            onClick={() => onNavigate('shipments')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.8125rem', marginTop: '12px' }}
          >
            Go to Shipments List
          </button>
        </div>
      </div>
    );
  }

  const isDelivered = shipment.status === 'DELIVERED';
  const isInTransit = shipment.status === 'IN_TRANSIT' || isDelivered;

  return (
    <div className="page-layout-sidebar">
      
      {/* Sidebar */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Back Button */}
        <button
          onClick={() => onNavigate('shipments')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-muted)' }}
        >
          <ArrowLeft style={{ width: '15px', height: '15px' }} />
          <span>Back to Shipments</span>
        </button>

        {/* Header Summary */}
        <div className="card-panel" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 className="font-mono" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {shipment.shipmentId}
              </h1>
              <StatusBadge status={shipment.status} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Created: {shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : 'Recent'}
            </p>
          </div>

          <button
            onClick={() => onOpenStatusModal(shipment)}
            disabled={shipment.status === 'DELIVERED' || shipment.status === 'CANCELLED'}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.8125rem',
              opacity: (shipment.status === 'DELIVERED' || shipment.status === 'CANCELLED') ? 0.4 : 1
            }}
          >
            <Edit3 style={{ width: '14px', height: '14px' }} />
            <span>Update Status</span>
          </button>
        </div>

        {/* Large Route Visual Hero Banner */}
        <div className="route-hero-banner">
          <div className="route-hero-grid">
            
            {/* Origin */}
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
                Origin Hub
              </div>
              <div className="route-hub-name">
                {shipment.source}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>
                <MapPin style={{ width: '13px', height: '13px' }} />
                <span>Consignor Hub</span>
              </div>
            </div>

            {/* Flight Path with Plane */}
            <div className="route-flight-path">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.6875rem', fontWeight: '700', opacity: 0.85 }}>
                <span>{shipment.status}</span>
                <span>{shipment.weight} kg</span>
              </div>

              <div className="route-flight-line">
                <div className="route-plane-icon">
                  <Plane style={{ width: '16px', height: '16px', transform: 'rotate(45deg)' }} />
                </div>
              </div>

              <span style={{ fontSize: '0.625rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.8 }}>
                Direct Transit Corridor
              </span>
            </div>

            {/* Destination */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
                Destination Hub
              </div>
              <div className="route-hub-name">
                {shipment.destination}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', opacity: 0.9, marginTop: '2px', justifyContent: 'flex-end' }}>
                <MapPin style={{ width: '13px', height: '13px' }} />
                <span>Consignee Delivery</span>
              </div>
            </div>

          </div>
        </div>

        {/* 6 Key Metadata Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div className="card-panel" style={{ padding: '14px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Sender</span>
            <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.senderName}</div>
          </div>

          <div className="card-panel" style={{ padding: '14px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Receiver</span>
            <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.receiverName}</div>
          </div>

          <div className="card-panel" style={{ padding: '14px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Route</span>
            <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.source} → {shipment.destination}</div>
          </div>

          <div className="card-panel" style={{ padding: '14px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Weight</span>
            <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.weight} kg</div>
          </div>

          <div className="card-panel" style={{ padding: '14px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Tariff Cost</span>
            <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>₹{shipment.cost?.toFixed(2)}</div>
          </div>

          <div className="card-panel" style={{ padding: '14px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Package</span>
            <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.packageDescription}</div>
          </div>
        </div>

        {/* Tracking Timeline Card */}
        <div className="card-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid var(--border-card)', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`nav-pill-btn ${activeTab === 'tracking' ? 'active' : ''}`}
              style={{ fontSize: '0.8125rem' }}
            >
              Tracking Timeline
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`nav-pill-btn ${activeTab === 'audit' ? 'active' : ''}`}
              style={{ fontSize: '0.8125rem' }}
            >
              Audit Details
            </button>
          </div>

          {activeTab === 'tracking' ? (
            <div className="timeline-container">
              
              {/* Step 1: Created */}
              <div className="timeline-step">
                <div className="timeline-marker completed">
                  <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                </div>
                <div>
                  <div className="timeline-title">Shipment Created &amp; Manifest Generated</div>
                  <div className="timeline-desc">Consignment successfully registered in Supabase PostgreSQL database.</div>
                  <div className="timeline-time">{shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : 'N/A'}</div>
                </div>
              </div>

              {/* Step 2: In Transit */}
              <div className="timeline-step">
                <div className={`timeline-marker ${isInTransit ? 'completed' : ''}`}>
                  <Truck style={{ width: '13px', height: '13px' }} />
                </div>
                <div>
                  <div className="timeline-title" style={{ color: isInTransit ? 'var(--text-main)' : 'var(--text-subtle)' }}>
                    In Transit &amp; Departed Origin Hub
                  </div>
                  <div className="timeline-desc">Dispatched from {shipment.source} along regional logistics corridor.</div>
                  {isInTransit && (
                    <div className="timeline-time">{shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleString() : 'In Progress'}</div>
                  )}
                </div>
              </div>

              {/* Step 3: Delivered */}
              <div className="timeline-step">
                <div className={`timeline-marker ${isDelivered ? 'completed' : ''}`}>
                  <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                </div>
                <div>
                  <div className="timeline-title" style={{ color: isDelivered ? '#059669' : 'var(--text-subtle)' }}>
                    Delivered to Consignee
                  </div>
                  <div className="timeline-desc">Handed over at {shipment.destination} to {shipment.receiverName}.</div>
                  {isDelivered && (
                    <div className="timeline-time" style={{ color: '#059669', fontWeight: '700' }}>
                      Delivery Completed • Terminal State
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <strong>Database Record ID:</strong> <span className="font-mono">{shipment.shipmentId}</span>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <strong>PostgreSQL Updated Timestamp:</strong> <span className="font-mono">{shipment.updatedAt ? new Date(shipment.updatedAt).toISOString() : 'N/A'}</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
