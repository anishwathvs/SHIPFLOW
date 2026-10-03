import React, { useState } from 'react';
import { X, CheckCircle2, Truck, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function StatusUpdateModal({ shipment, onClose, onUpdateStatus }) {
  const [selectedStatus, setSelectedStatus] = useState(shipment?.status || 'CREATED');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!shipment) return null;

  const currentStatus = shipment.status;
  const isTerminal = currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED';

  const statusOptions = [
    { 
      id: 'CREATED', 
      label: 'Created', 
      desc: 'Shipment registered in manifest, awaiting dispatch', 
      icon: CheckCircle2,
      disabled: currentStatus !== 'CREATED'
    },
    { 
      id: 'IN_TRANSIT', 
      label: 'In Transit', 
      desc: 'En route along active logistics corridor', 
      icon: Truck,
      disabled: currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED'
    },
    { 
      id: 'DELIVERED', 
      label: 'Delivered', 
      desc: 'Successfully delivered to consignee (Terminal state)', 
      icon: CheckCircle2,
      disabled: currentStatus === 'CANCELLED'
    },
    { 
      id: 'CANCELLED', 
      label: 'Cancelled', 
      desc: 'Consignment terminated (Terminal state)', 
      icon: XCircle,
      disabled: currentStatus === 'DELIVERED'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onUpdateStatus(shipment.shipmentId, selectedStatus);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-card)' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Update Shipment Status
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Tracking ID: <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>{shipment.shipmentId}</span>
            </p>
          </div>

          <button onClick={onClose} className="icon-btn">
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Current State Callout */}
        <div style={{
          margin: '16px 0',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Current Status</span>
            <div style={{ marginTop: '4px' }}>
              <StatusBadge status={currentStatus} />
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Route</span>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>
              {shipment.source} → {shipment.destination}
            </div>
          </div>
        </div>

        {isTerminal && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'start',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle style={{ width: '16px', height: '16px', color: '#d97706', shrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Terminal State Protected:</strong> This shipment is marked as {currentStatus}. Per business lifecycle rules, terminal states cannot be changed.
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '0.75rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Options */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {statusOptions.map((opt) => {
            const isSelected = selectedStatus === opt.id;
            const isCurrent = currentStatus === opt.id;

            return (
              <label
                key={opt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--primary-blue)' : '1px solid var(--border-card)',
                  background: isSelected ? 'var(--primary-blue-light)' : opt.disabled ? 'var(--bg-subtle)' : '#ffffff',
                  opacity: opt.disabled ? 0.45 : 1,
                  cursor: opt.disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.id}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => setSelectedStatus(opt.id)}
                  style={{ marginTop: '2px', accentColor: 'var(--primary-blue)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      {opt.label}
                    </span>
                    {isCurrent && (
                      <span style={{ fontSize: '0.625rem', fontWeight: '800', textTransform: 'uppercase', background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px', color: '#475569' }}>
                        Current
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {opt.desc}
                  </p>
                </div>
              </label>
            );
          })}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isTerminal || selectedStatus === currentStatus}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.8125rem', opacity: (isTerminal || selectedStatus === currentStatus) ? 0.5 : 1 }}
            >
              {loading ? 'Updating...' : 'Save Status'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
