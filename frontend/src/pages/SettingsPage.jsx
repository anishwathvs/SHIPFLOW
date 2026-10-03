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
  Sliders
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { shipmentApi } from '../api/shipmentApi';

export function SettingsPage({ activePage, onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Notification toggles
  const [notifyTransition, setNotifyTransition] = useState(true);
  const [notifyDispatch, setNotifyDispatch] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(false);

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

  return (
    <div className="page-layout-sidebar">
      
      {/* Workspace Sidebar */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Settings Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Settings &amp; Workspace
            </h1>
            <p className="page-subtitle">
              Manage user profile, interface appearance, notification alerts, and system health.
            </p>
          </div>
        </div>

        {/* Settings Navigation Tabs (Profile, Appearance, Notifications, System, About) - API tab removed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-card)', paddingBottom: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`nav-pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User style={{ width: '14px', height: '14px' }} />
              <span>Profile</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`nav-pill-btn ${activeTab === 'appearance' ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette style={{ width: '14px', height: '14px' }} />
              <span>Appearance</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`nav-pill-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell style={{ width: '14px', height: '14px' }} />
              <span>Notifications</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`nav-pill-btn ${activeTab === 'system' ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server style={{ width: '14px', height: '14px' }} />
              <span>System</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`nav-pill-btn ${activeTab === 'about' ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info style={{ width: '14px', height: '14px' }} />
              <span>About</span>
            </span>
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
              Administrator Profile
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-primary)'
              }}>
                R
              </div>
              <div>
                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.9375rem' }}>reethika</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead Logistics Operator</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '640px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value="reethika"
                  className="form-control"
                  style={{ background: 'var(--bg-subtle)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  readOnly
                  value="Logistics Administrator"
                  className="form-control"
                  style={{ background: 'var(--bg-subtle)' }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  readOnly
                  value="reethika@example.com"
                  className="form-control"
                  style={{ background: 'var(--bg-subtle)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Appearance */}
        {activeTab === 'appearance' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
              Appearance &amp; Theme
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', maxWidth: '640px' }}>
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--primary-blue)',
                background: 'var(--primary-blue-light)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>Pure White Minimalist</span>
                  <CheckCircle2 style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Pristine high-contrast white surfaces with royal blue and violet logistics accents.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
              Notification Preferences
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', background: '#ffffff', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>Status Transition Alerts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify on shipment state changes to IN_TRANSIT or DELIVERED.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyTransition} 
                  onChange={(e) => setNotifyTransition(e.target.checked)} 
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }} 
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', background: '#ffffff', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>New Consignment Booking</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send instant alert when a new shipment is registered in the system.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyDispatch} 
                  onChange={(e) => setNotifyDispatch(e.target.checked)} 
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }} 
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', background: '#ffffff', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>Daily Digest Summary</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive daily operational metrics and delivery performance reports.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyDailyDigest} 
                  onChange={(e) => setNotifyDailyDigest(e.target.checked)} 
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }} 
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: System (Live Backend & Database Health) */}
        {activeTab === 'system' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  System Diagnostics &amp; Health Telemetry
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Live response from <code>GET /api/health</code>
                </p>
              </div>

              <button
                onClick={fetchHealth}
                disabled={healthLoading}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                {healthLoading ? (
                  <Loader2 style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <RefreshCw style={{ width: '13px', height: '13px' }} />
                )}
                <span>Ping Health</span>
              </button>
            </div>

            {healthData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px' }}>
                
                {/* Database Connectivity Status Banner */}
                <div style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: healthData.database === 'CONNECTED' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                  background: healthData.database === 'CONNECTED' ? '#ecfdf5' : '#fef2f2',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <Database style={{ width: '20px', height: '20px', color: healthData.database === 'CONNECTED' ? '#059669' : '#dc2626', shrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: healthData.database === 'CONNECTED' ? '#065f46' : '#991b1b' }}>
                      Supabase PostgreSQL: {healthData.database}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: healthData.database === 'CONNECTED' ? '#047857' : '#b91c1c', marginTop: '2px' }}>
                      {healthData.database === 'CONNECTED'
                        ? 'Persistent relational cloud database connected via JDBC with SSL encryption.'
                        : 'Database is in local or development mode.'}
                    </p>
                  </div>
                </div>

                {/* Technical Diagnostic Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>REST Server</span>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>{healthData.service || 'AppServer'}</div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Status</span>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#059669', marginTop: '2px' }}>{healthData.status || 'UP'}</div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Persistence Engine</span>
                    <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#059669', marginTop: '2px' }}>PostgreSQL 15 / JDBC</div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Last Ping</span>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginTop: '2px' }}>
                      {healthData.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'N/A'}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Checking live system health...
              </div>
            )}
          </div>
        )}

        {/* Tab 5: About */}
        {activeTab === 'about' && (
          <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
              About SHIPFLOW Platform
            </h2>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '10px' }}>
                <strong>SHIPFLOW</strong> is an enterprise-grade logistics orchestration and shipment management platform providing real-time tracking, tiered tariff calculation, interactive mapping telemetry, and cloud database persistence.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div><strong>Version:</strong> 1.0.0 (Production Release)</div>
                <div><strong>Backend:</strong> Java 21 REST API, Sun HttpHandler, JDBC Architecture</div>
                <div><strong>Database:</strong> Supabase PostgreSQL (SSL Mode Require)</div>
                <div><strong>Frontend:</strong> React 18, Vite 5, Pure Vanilla CSS Design System</div>
                <div><strong>Mapping:</strong> Google Maps JavaScript API &amp; Leaflet CartoDB Positron</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
