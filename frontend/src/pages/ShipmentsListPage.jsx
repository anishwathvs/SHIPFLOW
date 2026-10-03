import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Eye, 
  Edit3, 
  Plus, 
  X, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { StatusBadge } from '../components/StatusBadge';

export function ShipmentsListPage({ 
  shipments = [], 
  activePage, 
  onNavigate, 
  onSelectShipment,
  onOpenStatusModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchesSearch = 
        !searchTerm.trim() ||
        (s.shipmentId && s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (s.senderName && s.senderName.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (s.receiverName && s.receiverName.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (s.source && s.source.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (s.destination && s.destination.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (s.packageDescription && s.packageDescription.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchesStatus = 
        statusFilter === 'ALL' || 
        (s.status && s.status.toUpperCase() === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage) || 1;
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(start, start + itemsPerPage);
  }, [filteredShipments, currentPage]);

  const handleClear = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="page-layout-sidebar">
      
      {/* Workspace Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Table Viewport Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Shipments
            </h1>
            <p className="page-subtitle">
              Manage and track all consignments recorded in Supabase PostgreSQL storage.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onNavigate('create')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.8125rem' }}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span>Create Shipment</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, sender, receiver, route hub..."
              className="form-control"
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.8125rem' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8' }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>

          {/* Quick Filter Pill Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'CREATED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`nav-pill-btn ${statusFilter === st ? 'active' : ''}`}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                {st === 'ALL' ? 'All Records' : st.replace('_', ' ')}
              </button>
            ))}

            {(searchTerm || statusFilter !== 'ALL') && (
              <button
                onClick={handleClear}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', marginLeft: '4px' }}
                title="Reset Filters"
              >
                <RotateCcw style={{ width: '12px', height: '12px' }} />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Expansive Data Table Card */}
        <div className="table-wrapper" style={{ boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          {filteredShipments.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-main)' }}>
                No shipments found
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: '360px', lineHeight: '1.5' }}>
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No registered consignments match your current search query or active status filter.'
                  : 'Start by creating your first global package consignment.'}
              </p>
              {searchTerm || statusFilter !== 'ALL' ? (
                <button
                  onClick={handleClear}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.8125rem', marginTop: '6px' }}
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('create')}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.8125rem', marginTop: '6px' }}
                >
                  <Plus style={{ width: '14px', height: '14px' }} />
                  <span>Create Shipment</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Shipment ID</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Sender / Receiver</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Corridor Route</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Weight</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Tariff Cost</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedShipments.map((s) => (
                    <tr 
                      key={s.shipmentId}
                      onClick={() => onSelectShipment(s)}
                      style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                    >
                      <td className="font-mono" style={{ padding: '16px 18px', fontWeight: '800', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        {s.shipmentId}
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.875rem' }}>{s.senderName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>to {s.receiverName}</div>
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{s.source}</span>
                          <span style={{ color: '#94a3b8' }}>→</span>
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{s.destination}</span>
                        </div>
                        {s.packageDescription && (
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                            {s.packageDescription}
                          </div>
                        )}
                      </td>

                      <td className="font-mono" style={{ padding: '16px 18px', fontSize: '0.8125rem', color: 'var(--text-body)' }}>
                        {Number(s.weight || 0).toFixed(1)} kg
                      </td>

                      <td className="font-mono" style={{ padding: '16px 18px', fontWeight: '800', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        ${Number(s.cost || 0).toFixed(2)}
                      </td>

                      <td style={{ padding: '16px 18px' }}>
                        <StatusBadge status={s.status} />
                      </td>

                      <td style={{ padding: '16px 18px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => onSelectShipment(s)}
                            className="icon-btn"
                            style={{ width: '32px', height: '32px' }}
                            title="View Tracking Details"
                          >
                            <Eye style={{ width: '15px', height: '15px' }} />
                          </button>
                          <button
                            onClick={() => onOpenStatusModal(s)}
                            disabled={s.status === 'DELIVERED' || s.status === 'CANCELLED'}
                            className="icon-btn"
                            style={{
                              width: '32px',
                              height: '32px',
                              color: (s.status === 'DELIVERED' || s.status === 'CANCELLED') ? 'var(--text-subtle)' : 'var(--primary-blue)',
                              opacity: (s.status === 'DELIVERED' || s.status === 'CANCELLED') ? 0.3 : 1
                            }}
                            title="Update Status"
                          >
                            <Edit3 style={{ width: '15px', height: '15px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer with Pagination Controls */}
          {filteredShipments.length > 0 && (
            <div style={{
              padding: '14px 20px',
              background: 'var(--bg-subtle)',
              borderTop: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)'
            }}>
              <div>
                Showing <strong>{Math.min(filteredShipments.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
                <strong>{Math.min(filteredShipments.length, currentPage * itemsPerPage)}</strong> of{' '}
                <strong>{filteredShipments.length}</strong> total records
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.75rem', opacity: currentPage === 1 ? 0.4 : 1 }}
                  >
                    <ChevronLeft style={{ width: '14px', height: '14px' }} />
                    <span>Prev</span>
                  </button>
                  <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.75rem', opacity: currentPage === totalPages ? 0.4 : 1 }}
                  >
                    <span>Next</span>
                    <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
