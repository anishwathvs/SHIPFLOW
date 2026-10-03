import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  PlusCircle, 
  BarChart3, 
  Globe, 
  Settings,
  ShieldCheck
} from 'lucide-react';

export function SidebarNav({ activePage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'create', label: 'Create Shipment', icon: PlusCircle, isHighlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'map', label: 'Map View', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar-panel hide-mobile">
      <div className="sidebar-section-title">
        Command Center
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        if (item.isHighlight) {
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-btn sidebar-btn-highlight ${isActive ? 'active' : ''}`}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              <span>+ Create Shipment</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-btn ${isActive ? 'active' : ''}`}
          >
            <Icon style={{ width: '16px', height: '16px' }} />
            <span>{item.label}</span>
          </button>
        );
      })}

      <div className="sidebar-footer-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
          <ShieldCheck style={{ width: '16px', height: '16px', color: '#059669' }} />
          <span>Supabase Live</span>
        </div>
        <p style={{ fontSize: '0.6875rem', color: '#64748b', lineHeight: '1.4' }}>
          PostgreSQL persistence &amp; SSL active.
        </p>
      </div>
    </aside>
  );
}
