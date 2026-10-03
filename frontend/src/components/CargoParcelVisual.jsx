import React from 'react';
import { Package, CheckCircle2, Shield, Scale, MapPin } from 'lucide-react';

export function CargoParcelVisual({ weight = 3.0, height = '220px' }) {
  const numWeight = parseFloat(weight) || 3.0;

  return (
    <div style={{
      width: '100%',
      height,
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #eef2ff 100%)',
      border: '1px solid #bfdbfe',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 2px 8px rgba(37, 99, 235, 0.05)'
    }}>
      
      {/* Top Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ffffff',
          padding: '4px 10px',
          borderRadius: '9999px',
          border: '1px solid #bfdbfe',
          fontSize: '0.6875rem',
          fontWeight: '700',
          color: '#2563eb'
        }}>
          <Package style={{ width: '13px', height: '13px' }} />
          <span>CARGO SPECIFICATION</span>
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          fontWeight: '800',
          color: '#1d4ed8',
          background: '#dbeafe',
          padding: '3px 8px',
          borderRadius: '6px'
        }}>
          {numWeight.toFixed(1)} KG
        </div>
      </div>

      {/* Center 3D Isometric Cardboard Box Graphic */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
        <div style={{
          width: '110px',
          height: '95px',
          background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
          borderRadius: '12px',
          boxShadow: '0 14px 28px -4px rgba(180, 83, 9, 0.3), 0 4px 10px rgba(0,0,0,0.1)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #f59e0b',
          transform: 'rotate(-3deg)'
        }}>
          {/* Sealing Tape */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '24px',
            background: 'rgba(254, 243, 199, 0.4)',
            borderLeft: '1px dashed #78350f',
            borderRight: '1px dashed #78350f'
          }} />

          {/* Shipping Barcode Label */}
          <div style={{
            background: '#ffffff',
            padding: '4px 8px',
            borderRadius: '4px',
            zIndex: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.5625rem', fontWeight: '800', color: '#0f172a', letterSpacing: '0.05em' }}>
              SHIPFLOW
            </div>
            <div style={{
              height: '10px',
              width: '50px',
              background: 'repeating-linear-gradient(90deg, #0f172a, #0f172a 2px, transparent 2px, transparent 4px)',
              margin: '2px 0'
            }} />
          </div>
        </div>
      </div>

      {/* Bottom Features Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.6875rem',
        color: '#64748b',
        borderTop: '1px solid rgba(191, 219, 254, 0.6)',
        paddingTop: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Shield style={{ width: '12px', height: '12px', color: '#10b981' }} />
          <span>Insured Transit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 style={{ width: '12px', height: '12px', color: '#2563eb' }} />
          <span>Priority Handling</span>
        </div>
      </div>

    </div>
  );
}
