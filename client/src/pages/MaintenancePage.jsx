import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Wrench, ShieldCheck, AlertTriangle, Calendar, User, DollarSign, Activity } from 'lucide-react';

export default function MaintenancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMaint() {
      try {
        const res = await api.getMaintenance();
        setData(res);
      } catch (err) {
        console.error('Error fetching maintenance:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMaint();
  }, []);

  if (loading) return <LoadingSpinner text="Checking robotic subsystem diagnostics..." />;

  const robot = data || {};
  const components = robot.components || [
    { name: 'Hypertherm Plasma Cutting Torch', healthScore: 92, status: 'Optimal' },
    { name: 'Hydraulic Multi-Axis Arm Actuator', healthScore: 88, status: 'Good' },
    { name: 'LiDAR & Optical Visual Guidance', healthScore: 97, status: 'Optimal' },
    { name: 'Caterpillar Track Magnetic Grip', healthScore: 79, status: 'Warning' },
    { name: 'Fume Extraction & Cooling Shield', healthScore: 94, status: 'Optimal' },
  ];
  const logs = robot.logs || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-xl font-bold text-white">Robotic Crawler Health & Maintenance Suite</h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Real-time multi-sensor telemetry for plasma nozzles, magnetic crawler traction, and 6-axis kinematics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs px-3 py-1">
            UNIT: {robot.robotId || 'CUT-ROBOT-TITAN-X1'}
          </span>
          <span className="badge bg-neutral-800 text-white font-mono text-xs px-3 py-1">
            STATUS: {robot.robotStatus || 'OPERATIONAL'}
          </span>
        </div>
      </div>

      {/* Components Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((comp) => {
          const isWarning = comp.healthScore < 80;
          return (
            <div
              key={comp.name}
              className="card-surface p-5 border border-dark-border bg-dark-card hover:bg-neutral-900/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`badge font-mono text-[10px] ${
                      isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {comp.status || (isWarning ? 'Warning' : 'Optimal')}
                  </span>
                  <span className="text-lg font-bold font-mono text-white">
                    {comp.healthScore}%
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{comp.name}</h4>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-900 rounded-full h-2 mt-4 overflow-hidden border border-neutral-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isWarning ? 'bg-amber-400' : 'bg-accent-cyan'
                  }`}
                  style={{ width: `${comp.healthScore}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance History Log */}
      <div className="card-surface border border-dark-border bg-dark-card overflow-hidden">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-cyan" />
            <h3 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
              Service Schedules & Intervention Records
            </h3>
          </div>
          <button
            onClick={() => alert('Scheduled routine nozzle inspection for tomorrow 08:00 AM.')}
            className="btn-primary text-xs py-1.5 px-3"
          >
            + Schedule Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 font-mono text-[11px] text-neutral-400 uppercase border-b border-dark-border">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Intervention Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Service Cost</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-neutral-300">{log.date || '2026-09-28'}</td>
                  <td className="py-3 px-4 font-medium text-white">{log.type}</td>
                  <td className="py-3 px-4 text-neutral-300 max-w-sm">{log.description}</td>
                  <td className="py-3 px-4 text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{log.technician}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-white">₹{log.cost?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge font-mono text-[10px] uppercase ${
                        log.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
