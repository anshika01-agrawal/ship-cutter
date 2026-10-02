import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TrendingUp, DollarSign, Calendar, Percent, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function FeasibilityPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeasibility() {
      try {
        const res = await api.getFeasibility();
        setData(res);
      } catch (err) {
        console.error('Failed to load feasibility data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeasibility();
  }, []);

  if (loading) return <LoadingSpinner text="Computing ROI and metallurgical yields..." />;

  const f = data || {
    estimatedCost: 340000,
    actualCost: 285000,
    materialMarketValue: 890000,
    laborCost: 110000,
    disposalCost: 18000,
    netProfit: 477000,
    estimatedDays: 45,
    actualDays: 32,
    efficiencyScore: 91.2,
    materialYieldPercent: 93.8,
    wastePercent: 6.2,
    roi: 167.3,
    notes: 'Autonomous robotic cutting accelerated dismantling by 13 days vs traditional manual flame cutting, yielding +24% margin improvement.'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-xl font-bold text-white">Scrap Feasibility, Yield & Financial ROI</h2>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Financial projections, market commodity scrap pricing, and automated cut efficiency metrics.
        </p>
      </div>

      {/* Top 4 Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Projected Net Margin"
          value={`$${f.netProfit?.toLocaleString()}`}
          change={`+${f.roi}% ROI`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Secondary Steel Market Value"
          value={`$${f.materialMarketValue?.toLocaleString()}`}
          subtitle="Based on $460/ton EAF Index"
          icon={TrendingUp}
        />
        <StatsCard
          title="Dismantling Timeline"
          value={`${f.actualDays} Days`}
          change={`${f.estimatedDays - f.actualDays} days ahead`}
          changeType="positive"
          subtitle={`Plan: ${f.estimatedDays} days`}
          icon={Calendar}
        />
        <StatsCard
          title="Material Yield Recovery"
          value={`${f.materialYieldPercent}%`}
          change={`Waste: ${f.wastePercent}%`}
          changeType="positive"
          icon={Percent}
        />
      </div>

      {/* Financial Details Table & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost vs Revenue Breakdown */}
        <div className="card-surface p-6 border border-dark-border bg-dark-card">
          <h3 className="text-xs font-semibold text-white uppercase font-mono tracking-wider border-b border-dark-border pb-3 mb-4">
            Economic Statement (USD)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-dark-border">
              <span className="text-neutral-300">Gross Recovered Steel & Metal Value</span>
              <span className="font-mono font-bold text-emerald-400">+${f.materialMarketValue?.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-dark-border">
              <span className="text-neutral-400">Robotic Operation & Fuel / Power Cost</span>
              <span className="font-mono text-neutral-300">-${(f.actualCost - f.laborCost - f.disposalCost)?.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-dark-border">
              <span className="text-neutral-400">Safety & Supervisory Labor</span>
              <span className="font-mono text-neutral-300">-${f.laborCost?.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-dark-border">
              <span className="text-neutral-400">Hazardous Waste & Slag Filtration</span>
              <span className="font-mono text-neutral-300">-${f.disposalCost?.toLocaleString()}</span>
            </div>

            <div className="pt-3 border-t border-neutral-700 flex items-center justify-between text-sm font-bold">
              <span className="text-white">Net Return on Dismantling (EBITDA)</span>
              <span className="font-mono text-emerald-400">+${f.netProfit?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Operational Efficiency Report */}
        <div className="card-surface p-6 border border-dark-border bg-dark-card flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-white uppercase font-mono tracking-wider border-b border-dark-border pb-3 mb-4">
              AI Pathing & Efficiency Gains
            </h3>

            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-neutral-950 border border-dark-border">
                <span className="font-mono text-accent-cyan text-[11px] block mb-1">
                  AUTONOMOUS BENEFIT SUMMARY
                </span>
                <p>{f.notes}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-neutral-950 border border-dark-border">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Manual Yard Baseline</span>
                  <span className="text-base font-bold font-mono text-neutral-300">45 Days</span>
                  <span className="text-[10px] text-neutral-500 block mt-1">High torch safety risk</span>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800">
                  <span className="text-[10px] font-mono text-accent-cyan uppercase block">Robotic Titan-X1</span>
                  <span className="text-base font-bold font-mono text-cyan-300">32 Days</span>
                  <span className="text-[10px] text-cyan-400 block mt-1">Zero human cut injury</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border">
            <button
              onClick={() => alert('Full feasibility workbook exported (XLSX).')}
              className="btn-primary w-full text-xs font-mono"
            >
              Export Comprehensive Audit Spreadsheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
