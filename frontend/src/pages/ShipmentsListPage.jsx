import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Eye, 
  Edit3, 
  Plus, 
  X,
  RotateCcw
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
  const itemsPerPage = 8;

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
      
      {/* Sidebar */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Table Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Shipments
            </h1>
            <p className="page-subtitle">
              View and manage all active, in-transit, and delivered consignments.
            </p>
          </div>

          <button
            onClick={() => onNavigate('create')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
          >
            <Plus style={{ width: '15px', height: '15px' }} />
            <span>Create Shipment</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-panel" style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, sender, receiver, route..."
              className="form-control"
              style={{ paddingLeft: '34px', fontSize: '0.8125rem', padding: '8px 12px 8px 34px' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '8px', color: '#94a3b8' }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.8125rem', width: '140px', cursor: 'pointer' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="CREATED">Created</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {(searchTerm || statusFilter !== 'ALL') && (
              <button
                onClick={handleClear}
                className="btn-secondary"
                style={{ padding: '7px 12px', fontSize: '0.75rem' }}
                title="Reset Filters"
              >
                <RotateCcw style={{ width: '12px', height: '12px' }} />
                <span>Clear</span>
              </button>
            )}
          </div>

        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          {filteredShipments.length === 0 ? (
            <div style={{ padding: '48px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package style={{ width: '24px', height: '24px' }} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-main)' }}>
                No shipments found
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '320px' }}>
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No shipments match your current search and filter criteria.'
                  : 'Start by registering your first package consignment.'}
              </p>
              <button
                onClick={() => onNavigate('create')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8125rem', marginTop: '6px' }}
              >
                + Create Shipment
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sender → Receiver</th>
                    <th>Route</th>
                    <th>Weight</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedShipments.map((s) => (
                    <tr 
                      key={s.shipmentId}
                      onClick={() => onSelectShipment(s)}
                    >
                      <td className="font-mono" style={{ fontWeight: '800', color: 'var(--text-main)' }}>
                        {s.shipmentId}
                      </td>

                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{s.senderName}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>to {s.receiverName}</div>
                      </td>

                      <td>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{s.source}</span>
                        <span style={{ color: '#94a3b8', margin: '0 6px' }}>→</span>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{s.destination}</span>
                      </td>

                      <td className="font-mono">
                        {s.weight?.toFixed(1)} kg
                      </td>

                      <td className="font-mono" style={{ fontWeight: '800', color: 'var(--text-main)' }}>
                        ₹{s.cost?.toFixed(2)}
                      </td>

                      <td>
                        <StatusBadge status={s.status} />
                      </td>

                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => onSelectShipment(s)}
                            className="icon-btn"
                            style={{ width: '30px', height: '30px' }}
                            title="View Details"
                          >
                            <Eye style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            onClick={() => onOpenStatusModal(s)}
                            className="icon-btn"
                            style={{ width: '30px', height: '30px', color: '#2563eb' }}
                            title="Update Status"
                          >
                            <Edit3 style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer with Pagination */}
          {filteredShipments.length > 0 && (
            <div style={{
              padding: '12px 18px',
              background: 'var(--bg-subtle)',
              borderTop: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <div>
                Showing <strong style={{ color: 'var(--text-main)' }}>{paginatedShipments.length}</strong> of{' '}
                <strong style={{ color: 'var(--text-main)' }}>{filteredShipments.length}</strong> shipments
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.6875rem', opacity: currentPage === 1 ? 0.4 : 1 }}
                  >
                    Previous
                  </button>
                  <span style={{ fontWeight: '700', padding: '0 4px' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.6875rem', opacity: currentPage === totalPages ? 0.4 : 1 }}
                  >
                    Next
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
