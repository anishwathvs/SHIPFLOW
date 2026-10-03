import React, { useState, useEffect } from 'react';
import { 
  RefreshCw,
  Database,
  Loader2,
  CheckCircle2,
  User,
  Palette,
  Bell,
  Server,
  Info,
  ShieldCheck,
  Globe,
  Sliders,
  Check,
  Activity,
  Layers,
  Sparkles,
  Lock,
  Cpu
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { shipmentApi } from '../api/shipmentApi';

export function SettingsPage({ activePage, onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState('reethika');
  const [profileRole, setProfileRole] = useState('Logistics Administrator');
  const [profileEmail, setProfileEmail] = useState('reethika@example.com');

  // Appearance State
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [interfaceDensity, setInterfaceDensity] = useState('comfortable');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Notification Toggles
  const [notifyTransition, setNotifyTransition] = useState(true);
  const [notifyDispatch, setNotifyDispatch] = useState(true);
  const [notifyDelivery, setNotifyDelivery] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(false);
  const [notifySystemHealth, setNotifySystemHealth] = useState(true);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const data = await shipmentApi.checkHealth();
      setHealthData(data);
    } catch (err) {
      setHealthData({ status: 'DOWN', error: err.message, database: 'DISCONNECTED' });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="page-layout-sidebar">
      
      {/* Workspace Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Settings Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Settings &amp; Workspace
            </h1>
            <p className="page-subtitle">
              Manage your profile, preferences, notifications and system configuration.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <ShieldCheck style={{ width: '14px', height: '14px', color: '#059669' }} />
              <span>Workspace Node: Active</span>
            </span>
          </div>
        </div>

        {/* Settings Tab Navigation Pill Strip (Profile, Appearance, Notifications, System, About) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-card)',
          paddingBottom: '14px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`nav-pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <User style={{ width: '15px', height: '15px' }} />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`nav-pill-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Palette style={{ width: '15px', height: '15px' }} />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`nav-pill-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Bell style={{ width: '15px', height: '15px' }} />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`nav-pill-btn ${activeTab === 'system' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Server style={{ width: '15px', height: '15px' }} />
            <span>System Diagnostics</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`nav-pill-btn ${activeTab === 'about' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Info style={{ width: '15px', height: '15px' }} />
            <span>About</span>
          </button>
        </div>

        {/* ====================================================================
            Tab 1: Profile
            ==================================================================== */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* Profile Form Card */}
            <div className="card-panel">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-main)', paddingBottom: '12px', borderBottom: '1px solid var(--border-card)', marginBottom: '20px' }}>
                Account &amp; Operator Profile
              </h2>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '8px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-violet) 100%)',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-primary)'
                  }}>
                    R
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.0625rem' }}>{profileName}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{profileRole}</div>
                    <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.6875rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8' }}>
                      Verified Operator
                    </span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Operational Role</label>
                  <input
                    type="text"
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-card)', marginTop: '8px' }}>
                  {savedSuccess ? (
                    <span style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                      Preferences saved successfully!
                    </span>
                  ) : <span />}

                  <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8125rem' }}>
                    <span>Save Changes</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Profile Overview & Metadata Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card-panel">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px' }}>
                  Workspace Metadata
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Account Tier</span>
                    <strong style={{ color: 'var(--text-main)' }}>Enterprise Logistics</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Node</span>
                    <strong style={{ color: 'var(--text-main)' }}>APAC Central Node 01</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Access Level</span>
                    <strong style={{ color: '#059669' }}>Full Read / Write / Dispatch</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Session Initialized</span>
                    <strong className="font-mono" style={{ color: 'var(--text-body)' }}>{new Date().toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <div className="card-panel" style={{ background: '#f8fafc', border: '1px solid var(--border-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Lock style={{ width: '18px', height: '18px', color: 'var(--primary-blue)' }} />
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>Security &amp; Credentials</h4>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Supabase database secrets and JDBC connection credentials are encapsulated securely on the server side via environment protection.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ====================================================================
            Tab 2: Appearance
            ==================================================================== */}
        {activeTab === 'appearance' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Theme &amp; Visual Presentation
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Customize the UI palette, contrast, and layout density for your workspace.
              </p>
            </div>

            {/* Theme Options */}
            <div>
              <label className="form-label" style={{ fontWeight: '700', marginBottom: '12px' }}>Color Palette</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                
                {/* Pure White Minimalist */}
                <div 
                  onClick={() => setSelectedTheme('light')}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    border: selectedTheme === 'light' ? '2px solid var(--primary-blue)' : '1px solid var(--border-card)',
                    background: selectedTheme === 'light' ? 'var(--primary-blue-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)' }}>Pure White Minimalist</span>
                    {selectedTheme === 'light' && <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--primary-blue)' }} />}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Pristine high-contrast white surfaces with royal blue and violet logistics accents.
                  </p>
                </div>

                {/* High-Contrast Control */}
                <div 
                  onClick={() => setSelectedTheme('contrast')}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    border: selectedTheme === 'contrast' ? '2px solid var(--primary-blue)' : '1px solid var(--border-card)',
                    background: selectedTheme === 'contrast' ? 'var(--primary-blue-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)' }}>High-Contrast Operational</span>
                    {selectedTheme === 'contrast' && <CheckCircle2 style={{ width: '20px', height: '20px', color: 'var(--primary-blue)' }} />}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Crisp borders and elevated typography for high-density command center monitors.
                  </p>
                </div>

              </div>
            </div>

            {/* Interface Density */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
              <label className="form-label" style={{ fontWeight: '700', marginBottom: '12px' }}>Interface Density</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div 
                  onClick={() => setInterfaceDensity('comfortable')}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: interfaceDensity === 'comfortable' ? '2px solid var(--primary-blue)' : '1px solid var(--border-card)',
                    background: interfaceDensity === 'comfortable' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '4px' }}>Comfortable (Default)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spacious cards with 24-32px rhythmic spacing.</div>
                </div>

                <div 
                  onClick={() => setInterfaceDensity('compact')}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: interfaceDensity === 'compact' ? '2px solid var(--primary-blue)' : '1px solid var(--border-card)',
                    background: interfaceDensity === 'compact' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '4px' }}>Compact Telemetry</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tighter padding for high-volume shipment workflows.</div>
                </div>
              </div>
            </div>

            {/* Motion Preferences */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
              <div className="toggle-switch-container">
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>Reduced Motion Animations</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Disable interactive spring animations and 3D globe rotations.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={reducedMotion} 
                  onChange={(e) => setReducedMotion(e.target.checked)} 
                  className="toggle-switch-input"
                />
              </div>
            </div>

          </div>
        )}

        {/* ====================================================================
            Tab 3: Notifications
            ==================================================================== */}
        {activeTab === 'notifications' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Notification Preferences &amp; Dispatch Alerts
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Configure live push alerts, lifecycle status triggers, and daily digest summaries.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <label className="toggle-switch-container">
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>Status Transition Alerts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Notify when shipment moves through lifecycle states (e.g. IN_TRANSIT, DELIVERED).
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyTransition} 
                  onChange={(e) => setNotifyTransition(e.target.checked)} 
                  className="toggle-switch-input"
                />
              </label>

              <label className="toggle-switch-container">
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>New Consignment Booking</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Send an instant desktop alert whenever a new consignment is registered.
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyDispatch} 
                  onChange={(e) => setNotifyDispatch(e.target.checked)} 
                  className="toggle-switch-input"
                />
              </label>

              <label className="toggle-switch-container">
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>Proof of Delivery Confirmations</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Receive real-time notification upon final destination delivery handoff.
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyDelivery} 
                  onChange={(e) => setNotifyDelivery(e.target.checked)} 
                  className="toggle-switch-input"
                />
              </label>

              <label className="toggle-switch-container">
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>Daily Operational Digest</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Summarized end-of-day report of active freight volume and corridor load.
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyDailyDigest} 
                  onChange={(e) => setNotifyDailyDigest(e.target.checked)} 
                  className="toggle-switch-input"
                />
              </label>

              <label className="toggle-switch-container">
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>System &amp; Infrastructure Health Warnings</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Alert if database connection latency increases or server errors occur.
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifySystemHealth} 
                  onChange={(e) => setNotifySystemHealth(e.target.checked)} 
                  className="toggle-switch-input"
                />
              </label>

            </div>
          </div>
        )}

        {/* ====================================================================
            Tab 4: System Diagnostics
            ==================================================================== */}
        {activeTab === 'system' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-card)', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  System Diagnostics &amp; Infrastructure Health
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Real-time telemetry response from Java backend: <code>GET /api/health</code>
                </p>
              </div>

              <button
                onClick={fetchHealth}
                disabled={healthLoading}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
              >
                {healthLoading ? (
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <RefreshCw style={{ width: '14px', height: '14px' }} />
                )}
                <span>Ping System Health</span>
              </button>
            </div>

            {healthData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Database Connectivity Status Banner */}
                <div style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  border: healthData.database === 'CONNECTED' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                  background: healthData.database === 'CONNECTED' ? '#ecfdf5' : '#fef2f2',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <Database style={{ width: '24px', height: '24px', color: healthData.database === 'CONNECTED' ? '#059669' : '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: healthData.database === 'CONNECTED' ? '#065f46' : '#991b1b' }}>
                      Supabase PostgreSQL Relational Database: {healthData.database}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: healthData.database === 'CONNECTED' ? '#047857' : '#b91c1c', marginTop: '4px', lineHeight: '1.5' }}>
                      {healthData.database === 'CONNECTED'
                        ? 'Persistent cloud PostgreSQL database connected via Java JDBC with SSL mode (require) encryption. Tables schema verified.'
                        : 'Database connection failed or offline. Check local server environment configuration.'}
                    </p>
                  </div>
                </div>

                {/* 4 Technical Diagnostic Metrics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  
                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.04em' }}>
                      <Server style={{ width: '13px', height: '13px' }} />
                      <span>REST Server</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '6px' }}>
                      {healthData.service || 'AppServer'}
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.04em' }}>
                      <Activity style={{ width: '13px', height: '13px' }} />
                      <span>Server Status</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '800', color: '#059669', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      <span>{healthData.status || 'UP'} (Operational)</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.04em' }}>
                      <Layers style={{ width: '13px', height: '13px' }} />
                      <span>Persistence Driver</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '6px' }}>
                      PostgreSQL 15 / JDBC
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.04em' }}>
                      <Cpu style={{ width: '13px', height: '13px' }} />
                      <span>Last Diagnostic Ping</span>
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-body)', marginTop: '6px' }}>
                      {healthData.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'N/A'}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div style={{ padding: '36px 0', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
                Checking live system health telemetry...
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            Tab 5: About
            ==================================================================== */}
        {activeTab === 'about' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-main)' }}>
                About SHIPFLOW Platform
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Enterprise logistics orchestration, automated tiered tariff calculation, and real-time shipment telemetry.
              </p>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>SHIPFLOW</strong> is designed for modern supply chain operations, unifying package tracking, multi-corridor telemetry, distance-based and weight-tiered tariff evaluation, and high-performance relational database storage.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>Platform Version</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>1.0.0 (Enterprise Production Build)</span>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>Java Backend Stack</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Java 21, Sun HttpHandler REST API, JDBC Architecture</span>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>Database &amp; Storage</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Supabase PostgreSQL (SSL Mode Require)</span>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '4px' }}>Frontend Architecture</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>React 18, Vite 5, Dedicated Pure Vanilla CSS</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
