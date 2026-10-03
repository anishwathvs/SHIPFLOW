import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'info', message } = toast;

  let toastClass = '';
  if (type === 'success') toastClass = 'toast-card-success';
  if (type === 'error') toastClass = 'toast-card-error';

  return (
    <div className="toast-container">
      <div className={`toast-card ${toastClass}`}>
        {type === 'success' && <CheckCircle2 style={{ width: '18px', height: '18px', shrink: 0 }} />}
        {type === 'error' && <AlertCircle style={{ width: '18px', height: '18px', shrink: 0 }} />}
        {type === 'info' && <Info style={{ width: '18px', height: '18px', shrink: 0 }} />}
        
        <span>{message}</span>

        <button onClick={onClose} style={{ marginLeft: '8px', opacity: 0.7, cursor: 'pointer' }}>
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    </div>
  );
}
