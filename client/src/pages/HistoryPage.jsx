import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { History, Calendar, CheckCircle2, Download, Ship, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const ops = await api.getOperations();
        setOperations(ops);
      } catch (err) {
        console.error('Failed to load operations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) return <LoadingSpinner text="Retrieving historical mission logs..." />;

  const historicalRecords = [
    {
      id: 'OP-2026-AUG-710',
      shipName: 'Nordic Horizon',
      vesselType: 'Container Vessel (195m)',
      weight: '19,200 LDT',
      startDate: '2026-06-12',
      endDate: '2026-07-18',
      duration: '36 Days',
      partsCut: 380,
      recoveryRate: '94.2%',
      status: 'Completed',
    },
    {
      id: 'OP-2026-MAY-602',
      shipName: 'Baltic Starling',
      vesselType: 'Chemical Carrier (140m)',
      weight: '11,400 LDT',
      startDate: '2026-04-05',
      endDate: '2026-05-02',
      duration: '27 Days',
      partsCut: 215,
      recoveryRate: '96.1%',
      status: 'Completed',
    },
    {
      id: 'OP-2026-FEB-440',
      shipName: 'Pacific Mariner V',
      vesselType: 'Ore Carrier (290m)',
      weight: '38,500 LDT',
      startDate: '2026-01-10',
      endDate: '2026-02-28',
      duration: '49 Days',
      partsCut: 590,
      recoveryRate: '93.7%',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-xl font-bold text-white">Historical Robotic Cut Missions</h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Archived logs of decommissioned vessels and cutting duration benchmarks.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting all historical operations to CSV...')}
          className="btn-secondary text-xs flex items-center gap-2 self-start"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Mission Archive (CSV)</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {historicalRecords.map((rec) => (
          <div
            key={rec.id}
            className="card-surface p-5 border border-dark-border bg-dark-card hover:bg-neutral-900/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white shrink-0 group-hover:border-neutral-500">
                <Ship className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent-cyan">{rec.id}</span>
                  <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                    {rec.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{rec.shipName}</h3>
                <span className="text-xs text-neutral-400">{rec.vesselType} • {rec.weight}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-xs text-neutral-300 border-t md:border-t-0 md:border-l border-dark-border pt-3 md:pt-0 md:pl-6">
              <div>
                <span className="block text-[10px] font-mono text-neutral-500">TIMELINE</span>
                <span className="font-mono">{rec.duration}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-neutral-500">PARTS HARVESTED</span>
                <span className="font-mono">{rec.partsCut}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-neutral-500">RECOVERY RATE</span>
                <span className="font-mono text-emerald-400 font-bold">{rec.recoveryRate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
