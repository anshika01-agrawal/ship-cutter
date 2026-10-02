import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Ship, Plus, Anchor, CheckCircle2, Clock, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShipsPage() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShip, setNewShip] = useState({
    name: '',
    type: 'Bulk Carrier',
    weight: 25000,
    dimensions: { length: 200, width: 32, height: 18 },
    status: 'docked',
    notes: '',
  });

  useEffect(() => {
    async function loadShips() {
      try {
        const data = await api.getShips();
        setShips(data);
      } catch (err) {
        console.error('Failed to load ships:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShips();
  }, []);

  const handleAddShip = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createShip(newShip);
      setShips([created, ...ships]);
      setShowAddModal(false);
      setNewShip({
        name: '',
        type: 'Bulk Carrier',
        weight: 25000,
        dimensions: { length: 200, width: 32, height: 18 },
        status: 'docked',
        notes: '',
      });
    } catch (err) {
      alert('Failed to register vessel: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner text="Connecting to Harbor Dock Master Registry..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-xl font-bold text-white">Vessel Fleet & Dismantling Berths</h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Registered decommissioned ships, light displacement tonnages (LDT), and cutting progress.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Register New Vessel</span>
        </button>
      </div>

      {/* Ship Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ships.map((s) => (
          <div
            key={s._id || s.name}
            className="card-surface border border-dark-border bg-dark-card rounded-xl overflow-hidden hover:border-neutral-500 transition-all flex flex-col justify-between"
          >
            <div>
              {s.photos && s.photos[0] && (
                <div className="aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={s.photos[0]}
                    alt={s.name}
                    className="w-full h-full object-cover filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`badge font-mono text-[10px] uppercase ${
                      s.status === 'cutting_in_progress'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : s.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    {s.status?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">{s.type}</span>
                </div>

                <h3 className="text-base font-bold text-white">{s.name}</h3>

                <div className="mt-4 space-y-2 text-xs text-neutral-400 font-mono">
                  <div className="flex justify-between border-b border-dark-border/50 pb-1">
                    <span>Displacement (LDT):</span>
                    <span className="text-white font-bold">{s.weight?.toLocaleString()} Tons</span>
                  </div>
                  <div className="flex justify-between border-b border-dark-border/50 pb-1">
                    <span>Dimensions (L×W×H):</span>
                    <span className="text-white">
                      {s.dimensions?.length}m × {s.dimensions?.width}m × {s.dimensions?.height}m
                    </span>
                  </div>
                </div>

                {s.notes && (
                  <p className="mt-3 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {s.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                to="/dashboard"
                className="btn-secondary w-full text-xs flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Open Operations Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Ship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full border border-neutral-700 bg-neutral-950">
            <h3 className="text-base font-bold text-white mb-1">Register Incoming Vessel</h3>
            <p className="text-xs text-text-secondary mb-4">Record ship specifications for dismantling operations.</p>

            <form onSubmit={handleAddShip} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-text-secondary mb-1">VESSEL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MV Pacific Voyager"
                  value={newShip.name}
                  onChange={(e) => setNewShip({ ...newShip, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">VESSEL TYPE</label>
                  <select
                    value={newShip.type}
                    onChange={(e) => setNewShip({ ...newShip, type: e.target.value })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white"
                  >
                    <option value="Bulk Carrier">Bulk Carrier</option>
                    <option value="Crude Oil Tanker">Crude Oil Tanker</option>
                    <option value="Container Ship">Container Ship</option>
                    <option value="Chemical Tanker">Chemical Tanker</option>
                    <option value="General Cargo">General Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">WEIGHT (LDT TONS)</label>
                  <input
                    type="number"
                    value={newShip.weight}
                    onChange={(e) => setNewShip({ ...newShip, weight: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-secondary mb-1">NOTES</label>
                <textarea
                  rows={2}
                  placeholder="Marine steel grade, hazardous cargo clearance..."
                  value={newShip.notes}
                  onChange={(e) => setNewShip({ ...newShip, notes: e.target.value })}
                  className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary w-1/2 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary w-1/2 text-xs">
                  Register Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
