import React from 'react';

export default function StatsCard({ title, value, change, changeType, icon: Icon, unit = '', subtitle }) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <div className="card-surface p-5 bg-dark-card hover:bg-neutral-900/60 transition-all border border-dark-border group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 group-hover:text-accent-cyan group-hover:border-neutral-700 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">{value}</span>
        {unit && <span className="text-xs text-text-secondary font-mono">{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-mono text-[11px] font-medium px-1.5 py-0.5 rounded ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : isNegative
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && <span className="text-text-secondary truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
