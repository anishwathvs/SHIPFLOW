import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Globe, 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Settings,
  Truck
} from 'lucide-react';

export function Navbar({ activePage, onNavigate, totalShipments = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Globe },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'create', label: 'Create Shipment', icon: PlusCircle },
    { id: 'map', label: '3D Map', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => handleNav('landing')}>
          <div className="brand-icon">
            <Package style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <div className="brand-title">
              SHIP<span>FLOW</span>
            </div>
            <div className="brand-tagline">
              Global Shipment Control
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links Pill */}
        <nav className="nav-links-pill hide-mobile">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`nav-pill-btn ${activePage === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          
          {/* Quick Search Shortcut */}
          <div 
            onClick={() => handleNav('shipments')}
            className="search-pill-shortcut hide-mobile"
          >
            <Search style={{ width: '14px', height: '14px' }} />
            <span>Search shipments...</span>
            <span className="search-key-badge">/</span>
          </div>

          {/* Notifications Button */}
          <button 
            onClick={() => handleNav('dashboard')}
            className="icon-btn"
            title="Notifications"
          >
            <Bell style={{ width: '16px', height: '16px' }} />
            {totalShipments > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#2563eb'
              }} />
            )}
          </button>

          {/* User Avatar Badge & Sign In */}
          {activePage !== 'login' ? (
            <button 
              onClick={() => handleNav('login')}
              className="btn-secondary hide-mobile"
              style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: 'var(--radius-md)' }}
            >
              Sign In
            </button>
          ) : null}

          <div 
            onClick={() => handleNav('settings')}
            className="user-avatar-badge"
            title="Profile & Settings"
          >
            R
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="icon-btn hide-desktop"
            style={{ display: 'none' }}
          >
            {mobileOpen ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
          </button>

        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid var(--border-card)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`sidebar-btn ${activePage === item.id ? 'active' : ''}`}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
