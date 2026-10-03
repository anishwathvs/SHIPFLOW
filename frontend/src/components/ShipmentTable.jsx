import React from 'react';
import { Search, ArrowRight, Edit3, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';

export function ShipmentTable({
  shipments = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  onSearchSubmit,
  onOpenStatusModal,
  onRefresh,
}) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'IN_TRANSIT':
        return 'badge-status badge-in_transit';
      case 'DELIVERED':
        return 'badge-status badge-delivered';
      case 'CANCELLED':
        return 'badge-status badge-cancelled';
      case 'CREATED':
      default:
        return 'badge-status badge-created';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'IN_TRANSIT':
        return 'pulse-dot pulse-dot-cyan';
      case 'DELIVERED':
        return 'pulse-dot pulse-dot-emerald';
      case 'CANCELLED':
        return 'pulse-dot pulse-dot-rose';
      case 'CREATED':
      default:
        return 'pulse-dot pulse-dot-amber';
    }
  };

  return (
    <div className="glass-panel p-5 overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <span>Shipment Records</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              ({shipments.length} total)
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry and dispatch manifest
          </p>
        </div>

        {/* Search Bar & Refresh */}
        <div className="flex items-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit && onSearchSubmit(searchTerm);
            }}
            className="relative flex-1 sm:w-72"
          >
            <input
              type="text"
              placeholder="Search by ID or Route..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-glass pl-9 pr-3 py-2 text-xs font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </form>

          <button
            onClick={onRefresh}
            title="Refresh Manifest"
            className="p-2 rounded-lg bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-14 rounded-xl bg-slate-900/50 animate-pulse border border-white/5"
            />
          ))}
        </div>
      ) : shipments.length === 0 ? (
        /* Empty State */
        <div className="py-14 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 mb-3 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">No Shipments Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            {searchTerm
              ? `No shipment matches "${searchTerm}". Try another ID or reset search.`
              : 'The logistics manifest is currently empty. Click "Create Shipment" above to register a new package.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-desktop overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-mono text-slate-400">
                  <th className="pb-3 font-medium">SHIPMENT ID</th>
                  <th className="pb-3 font-medium">ORIGIN & DESTINATION</th>
                  <th className="pb-3 font-medium">PACKAGE DETAILS</th>
                  <th className="pb-3 font-medium">WEIGHT</th>
                  <th className="pb-3 font-medium">FREIGHT COST</th>
                  <th className="pb-3 font-medium">STATUS</th>
                  <th className="pb-3 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shipments.map((s) => (
                  <tr
                    key={s.shipmentId}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3.5 font-mono font-semibold text-cyan-300">
                      {s.shipmentId}
                    </td>

                    {/* Route */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <span>{s.source}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                        <span>{s.destination}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {s.senderName} → {s.receiverName}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 text-slate-300 max-w-xs truncate">
                      {s.packageDescription}
                    </td>

                    {/* Weight */}
                    <td className="py-3.5 font-mono text-slate-200">
                      {Number(s.weight).toFixed(2)} kg
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 font-mono font-bold text-white">
                      ₹{Number(s.cost).toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5">
                      <span className={getBadgeClass(s.status)}>
                        <span className={getStatusDot(s.status)} />
                        <span>{s.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onOpenStatusModal(s)}
                        className="btn-secondary py-1 px-2.5 text-xs rounded-lg inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100 hover:text-cyan-300 hover:border-cyan-500/40"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="cards-mobile">
            {shipments.map((s) => (
              <div
                key={s.shipmentId}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-cyan-300 text-sm">
                    {s.shipmentId}
                  </span>
                  <span className={getBadgeClass(s.status)}>
                    <span className={getStatusDot(s.status)} />
                    <span>{s.status}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>{s.source}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span>{s.destination}</span>
                </div>

                <div className="text-xs text-slate-300">
                  {s.packageDescription}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                  <span className="text-slate-400">{Number(s.weight).toFixed(2)} kg</span>
                  <span className="font-bold text-white">₹{Number(s.cost).toFixed(2)}</span>
                </div>

                <button
                  onClick={() => onOpenStatusModal(s)}
                  className="btn-secondary w-full py-1.5 text-xs justify-center mt-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Update Status</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
