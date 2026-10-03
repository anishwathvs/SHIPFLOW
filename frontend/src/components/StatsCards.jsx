import React from 'react';
import { Package, Truck, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

export function StatsCards({ shipments = [] }) {
  const total = shipments.length;
  const inTransit = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;
  const created = shipments.filter((s) => s.status === 'CREATED').length;
  const totalValue = shipments.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);

  const stats = [
    {
      label: 'TOTAL SHIPMENTS',
      value: total,
      icon: Package,
      color: 'from-blue-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      tag: 'Live In-Memory / DB',
    },
    {
      label: 'IN TRANSIT',
      value: inTransit,
      icon: Truck,
      color: 'from-cyan-500/20 to-sky-500/5',
      borderColor: 'border-sky-500/40',
      iconColor: 'text-sky-300',
      tag: 'Active Routes',
      glow: true,
    },
    {
      label: 'DELIVERED',
      value: delivered,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      tag: 'Completed',
    },
    {
      label: 'PENDING DISPATCH',
      value: created,
      icon: Clock,
      color: 'from-amber-500/20 to-yellow-500/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      tag: 'Created',
    },
    {
      label: 'FREIGHT VALUE',
      value: `₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: IndianRupee,
      color: 'from-purple-500/20 to-indigo-500/5',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      tag: 'Total Revenue',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 my-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-panel glass-panel-hover p-4 relative overflow-hidden flex flex-col justify-between ${stat.borderColor}`}
          >
            {/* Ambient subtle gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-40 pointer-events-none`} />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono tracking-wider text-slate-400">
                {stat.label}
              </span>
              <div className={`w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center ${stat.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="my-1">
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {stat.value}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-white/5">
              <span>{stat.tag}</span>
              {stat.glow && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
