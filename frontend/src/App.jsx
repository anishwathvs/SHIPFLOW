import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateShipmentPage } from './pages/CreateShipmentPage';
import { ShipmentsListPage } from './pages/ShipmentsListPage';
import { ShipmentDetailsPage } from './pages/ShipmentDetailsPage';
import { GlobalMapPage } from './pages/GlobalMapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { shipmentApi } from './api/shipmentApi';
import { 
  Globe, 
  LayoutDashboard, 
  Truck, 
  PlusCircle, 
  BarChart3, 
  Loader2
} from 'lucide-react';

export function App() {
  const [activePage, setActivePage] = useState('landing');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [statusModalShipment, setStatusModalShipment] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load all shipments from Java REST API
  const loadShipments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await shipmentApi.fetchShipments();
      if (Array.isArray(data)) {
        setShipments(data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to connect to backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  // Compute live statistics from shipments array
  const stats = useMemo(() => {
    const total = shipments.length;
    let created = 0;
    let inTransit = 0;
    let delivered = 0;
    let cancelled = 0;

    shipments.forEach((s) => {
      const st = (s.status || '').toUpperCase();
      if (st === 'CREATED') created++;
      else if (st === 'IN_TRANSIT') inTransit++;
      else if (st === 'DELIVERED') delivered++;
      else if (st === 'CANCELLED') cancelled++;
    });

    return { total, created, inTransit, delivered, cancelled };
  }, [shipments]);

  // Navigate to Shipment Details
  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    setActivePage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Status update handler
  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      const updated = await shipmentApi.updateShipmentStatus(shipmentId, newStatus);
      showToast(`Shipment ${shipmentId} updated to ${newStatus}`, 'success');
      
      // Update local state
      setShipments((prev) => 
        prev.map((s) => (s.shipmentId === shipmentId ? { ...s, ...updated } : s))
      );

      if (selectedShipment && selectedShipment.shipmentId === shipmentId) {
        setSelectedShipment((prev) => ({ ...prev, ...updated }));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status.', 'error');
      throw err;
    }
  };

  const handleCreateSuccess = (created) => {
    showToast(`Shipment ${created.shipmentId} created successfully!`, 'success');
    loadShipments();
  };

  return (
    <div className="app-wrapper">
      
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalShipments={shipments.length}
      />

      {/* Main Content Viewport */}
      <main className="main-viewport">
        
        {loading && shipments.length === 0 ? (
          <div style={{ height: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Loader2 style={{ width: '32px', height: '32px', color: '#2563eb', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Connecting to Supabase PostgreSQL Database...
            </p>
          </div>
        ) : (
          <>
            {activePage === 'landing' && (
              <LandingPage
                shipments={shipments}
                stats={stats}
                onNavigate={setActivePage}
                onSelectShipment={handleSelectShipment}
              />
            )}

            {activePage === 'dashboard' && (
              <DashboardPage
                shipments={shipments}
                stats={stats}
                activePage={activePage}
                onNavigate={setActivePage}
                onSelectShipment={handleSelectShipment}
              />
            )}

            {activePage === 'create' && (
              <CreateShipmentPage
                activePage={activePage}
                onNavigate={setActivePage}
                onCreateSuccess={handleCreateSuccess}
              />
            )}

            {activePage === 'shipments' && (
              <ShipmentsListPage
                shipments={shipments}
                activePage={activePage}
                onNavigate={setActivePage}
                onSelectShipment={handleSelectShipment}
                onOpenStatusModal={(s) => setStatusModalShipment(s)}
              />
            )}

            {activePage === 'details' && (
              <ShipmentDetailsPage
                shipment={selectedShipment}
                activePage={activePage}
                onNavigate={setActivePage}
                onOpenStatusModal={(s) => setStatusModalShipment(s)}
              />
            )}

            {activePage === 'map' && (
              <GlobalMapPage
                shipments={shipments}
                stats={stats}
                activePage={activePage}
                onNavigate={setActivePage}
                onSelectShipment={handleSelectShipment}
              />
            )}

            {activePage === 'analytics' && (
              <AnalyticsPage
                shipments={shipments}
                stats={stats}
                activePage={activePage}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'settings' && (
              <SettingsPage
                activePage={activePage}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'login' && (
              <LoginPage
                onNavigate={setActivePage}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Status Update Modal */}
      {statusModalShipment && (
        <StatusUpdateModal
          shipment={statusModalShipment}
          onClose={() => setStatusModalShipment(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Mobile Floating Bottom Dock */}
      <div className="mobile-bottom-dock">
        <button
          onClick={() => setActivePage('landing')}
          className={`mobile-dock-btn ${activePage === 'landing' ? 'active' : ''}`}
        >
          <Globe style={{ width: '18px', height: '18px' }} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActivePage('dashboard')}
          className={`mobile-dock-btn ${activePage === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard style={{ width: '18px', height: '18px' }} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActivePage('create')}
          className="mobile-dock-fab"
          title="Create Shipment"
        >
          <PlusCircle style={{ width: '22px', height: '22px' }} />
        </button>

        <button
          onClick={() => setActivePage('shipments')}
          className={`mobile-dock-btn ${activePage === 'shipments' ? 'active' : ''}`}
        >
          <Truck style={{ width: '18px', height: '18px' }} />
          <span>Shipments</span>
        </button>

        <button
          onClick={() => setActivePage('analytics')}
          className={`mobile-dock-btn ${activePage === 'analytics' ? 'active' : ''}`}
        >
          <BarChart3 style={{ width: '18px', height: '18px' }} />
          <span>Analytics</span>
        </button>
      </div>

    </div>
  );
}

export default App;
