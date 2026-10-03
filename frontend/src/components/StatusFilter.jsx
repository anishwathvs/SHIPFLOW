import React from 'react';

export function StatusFilter({ activeStatus = 'ALL', onChangeStatus, counts = {} }) {
  const filters = [
    { key: 'ALL', label: 'All Shipments', count: counts.all || 0 },
    { key: 'CREATED', label: 'Created', count: counts.created || 0 },
    { key: 'IN_TRANSIT', label: 'In Transit', count: counts.in_transit || 0 },
    { key: 'DELIVERED', label: 'Delivered', count: counts.delivered || 0 },
    { key: 'CANCELLED', label: 'Cancelled', count: counts.cancelled || 0 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-950/80 border border-white/10 w-fit">
      {filters.map((f) => {
        const isActive = activeStatus === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChangeStatus(f.key)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              isActive
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                isActive ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
