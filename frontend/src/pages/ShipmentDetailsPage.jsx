import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Edit3,
  Plane,
  AlertCircle,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  Package,
  User,
  ShieldCheck,
  Calendar,
  Layers
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
        <div className="card-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <AlertCircle style={{ width: '40px', height: '40px', color: '#94a3b8', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>No Shipment Selected</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '320px', margin: '4px auto 16px auto' }}>
            Select an active consignment from the shipments list to view its complete tracking telemetry.
          </p>
          <button
            onClick={() => onNavigate('shipments')}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.8125rem' }}
          >
            Go to Shipments Workspace
          </button>
        </div>
      </div>
    );
  }

  const isDelivered = shipment.status === 'DELIVERED';
  const isCancelled = shipment.status === 'CANCELLED';
  const isInTransit = shipment.status === 'IN_TRANSIT' || isDelivered;

  return (
    <div className="page-layout-sidebar">
      
      {/* Workspace Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Details Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Back Link */}
        <div>
          <button
            onClick={() => onNavigate('shipments')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8125rem',
              fontWeight: '700',
              color: 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            <span>Back to Shipments</span>
          </button>
        </div>

        {/* Header Summary Card */}
        <div className="card-panel" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 className="font-mono" style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
                {shipment.shipmentId}
              </h1>
              <StatusBadge status={shipment.status} />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Registered on: {shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : 'Recent Operator Session'}
            </p>
          </div>

          <button
            onClick={() => onOpenStatusModal(shipment)}
            disabled={isDelivered || isCancelled}
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.8125rem',
              opacity: (isDelivered || isCancelled) ? 0.35 : 1
            }}
          >
            <Edit3 style={{ width: '15px', height: '15px' }} />
            <span>Update Lifecycle Status</span>
          </button>
        </div>

        {/* Large Route Visual Hero Banner */}
        <div className="route-hero-banner">
          <div className="route-hero-grid">
            
            {/* Origin Hub */}
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
                Origin Hub / Port
              </div>
              <div className="route-hub-name">
                {shipment.source}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>
                <MapPin style={{ width: '13px', height: '13px' }} />
                <span>{shipment.senderName}</span>
              </div>
            </div>

            {/* Flight Path with Plane */}
            <div className="route-flight-path">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.6875rem', fontWeight: '700', opacity: 0.85 }}>
                <span>Status: {shipment.status}</span>
                <span>{Number(shipment.weight || 0).toFixed(1)} kg</span>
              </div>

              <div className="route-flight-line">
                <div className="route-plane-icon">
                  <Plane style={{ width: '16px', height: '16px', transform: 'rotate(45deg)' }} />
                </div>
              </div>

              <span style={{ fontSize: '0.625rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.85 }}>
                Direct Transit Logistics Corridor
              </span>
            </div>

            {/* Destination Hub */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
                Destination Hub / City
              </div>
              <div className="route-hub-name">
                {shipment.destination}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', opacity: 0.9, marginTop: '2px', justifyContent: 'flex-end' }}>
                <MapPin style={{ width: '13px', height: '13px' }} />
                <span>{shipment.receiverName}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2-Column Details Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Consignment Attributes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="card-panel">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', paddingBottom: '12px', borderBottom: '1px solid var(--border-card)', marginBottom: '16px' }}>
                Consignment Specification
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                
                <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Sender / Consignor</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.senderName}</div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Receiver / Consignee</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.receiverName}</div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Origin Hub</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.source}</div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Destination Port</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.destination}</div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Gross Weight</span>
                  <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                    {Number(shipment.weight || 0).toFixed(1)} kg
                  </div>
                </div>

                <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Calculated Tariff</span>
                  <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--primary-blue)', marginTop: '4px' }}>
                    ${Number(shipment.cost || 0).toFixed(2)}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Cargo Package Description</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>{shipment.packageDescription || 'Standard Cargo Freight'}</div>
                </div>

              </div>
            </div>

            {/* Audit Metadata Card */}
            <div className="card-panel" style={{ background: '#f8fafc', border: '1px solid var(--border-card)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                Database Audit Log
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Database Primary Key:</span>
                  <strong className="font-mono" style={{ color: 'var(--text-main)' }}>{shipment.shipmentId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Created Timestamp:</span>
                  <strong className="font-mono" style={{ color: 'var(--text-body)' }}>{shipment.createdAt ? new Date(shipment.createdAt).toISOString() : 'N/A'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Updated:</span>
                  <strong className="font-mono" style={{ color: 'var(--text-body)' }}>{shipment.updatedAt ? new Date(shipment.updatedAt).toISOString() : 'N/A'}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Tracking Timeline */}
          <div className="card-panel">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', paddingBottom: '12px', borderBottom: '1px solid var(--border-card)', marginBottom: '24px' }}>
              Tracking Lifecycle Timeline
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Step 1: Created */}
              <div className="tracking-timeline-item completed">
                <div className="tracking-timeline-line" />
                <div className="tracking-timeline-node completed">
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Shipment Created &amp; Manifest Generated
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Consignment successfully logged into database by operator.
                  </p>
                  <div className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    {shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : 'Initial Record'}
                  </div>
                </div>
              </div>

              {/* Step 2: In Transit */}
              <div className={`tracking-timeline-item ${isInTransit ? 'completed' : ''}`}>
                <div className="tracking-timeline-line" />
                <div className={`tracking-timeline-node ${isInTransit ? 'completed' : (shipment.status === 'CREATED' ? 'active' : 'pending')}`}>
                  <Truck style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '800', color: isInTransit ? 'var(--text-main)' : 'var(--text-subtle)' }}>
                    Dispatched &amp; In Transit
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Package departed {shipment.source} hub along active transit corridor.
                  </p>
                  {isInTransit && (
                    <div className="font-mono" style={{ fontSize: '0.6875rem', color: '#2563eb', marginTop: '4px', fontWeight: '700' }}>
                      {shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleString() : 'Transit Active'}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Delivered or Cancelled */}
              {isCancelled ? (
                <div className="tracking-timeline-item">
                  <div className="tracking-timeline-node" style={{ background: '#dc2626', color: '#ffffff' }}>
                    <XCircle style={{ width: '16px', height: '16px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#991b1b' }}>
                      Shipment Cancelled &amp; Terminated
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Consignment order was terminated before final drop-off.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="tracking-timeline-item">
                  <div className={`tracking-timeline-node ${isDelivered ? 'completed' : 'pending'}`} style={{ background: isDelivered ? '#059669' : undefined, color: isDelivered ? '#ffffff' : undefined }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '800', color: isDelivered ? '#065f46' : 'var(--text-subtle)' }}>
                      Delivered to Consignee
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Final handoff completed at {shipment.destination} to {shipment.receiverName}.
                    </p>
                    {isDelivered && (
                      <div style={{ fontSize: '0.6875rem', color: '#059669', fontWeight: '800', marginTop: '4px' }}>
                        Delivery Completed • Terminal State
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
