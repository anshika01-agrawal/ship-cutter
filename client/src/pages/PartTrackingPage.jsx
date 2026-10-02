import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Layers, CheckCircle2, Clock, Trash2, Plus, Filter, Search, Tag } from 'lucide-react';

export default function PartTrackingPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPart, setNewPart] = useState({
    partId: '',
    name: '',
    type: 'Hull Plate',
    weight: 2500,
    thickness: 25,
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    async function loadParts() {
      try {
        const data = await api.getParts();
        setParts(data);
      } catch (err) {
        console.error('Error fetching parts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadParts();
  }, []);

  const handleAddPart = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createPart(newPart);
      setParts([created, ...parts]);
      setShowAddModal(false);
      setNewPart({
        partId: '',
        name: '',
        type: 'Hull Plate',
        weight: 2500,
        thickness: 25,
        status: 'pending',
        notes: '',
      });
    } catch (err) {
      alert('Failed to register part: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner text="Retrieving Part Tracking Manifest..." />;

  const filteredParts = parts.filter((part) => {
    const matchesFilter = filter === 'all' || part.status === filter;
    const matchesSearch =
      part.name?.toLowerCase().includes(search.toLowerCase()) ||
      part.partId?.toLowerCase().includes(search.toLowerCase()) ||
      part.type?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCount = parts.length;
  const cutCount = parts.filter((p) => p.status === 'cut').length;
  const inProgressCount = parts.filter((p) => p.status === 'in_progress').length;
  const pendingCount = parts.filter((p) => p.status === 'pending').length;
  const wasteCount = parts.filter((p) => p.status === 'waste').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Vessel Part Manifest & Structural Tracking</h2>
          <p className="text-xs text-text-secondary mt-1">
            Real-time status of dismantled plates, beams, bulkheads, and scrap offcuts.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Register New Structural Part</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard title="Total Tagged Parts" value={totalCount} unit="items" icon={Layers} />
        <StatsCard title="Extracted / Cut" value={cutCount} unit="items" icon={CheckCircle2} changeType="positive" change={`${totalCount ? ((cutCount / totalCount) * 100).toFixed(0) : 0}%`} />
        <StatsCard title="Pending Robotic Cut" value={pendingCount + inProgressCount} unit="items" icon={Clock} />
        <StatsCard title="Kerf Slag & Waste" value={wasteCount} unit="items" icon={Trash2} />
      </div>

      {/* Filter and Search Bar */}
      <div className="card-surface p-4 border border-dark-border bg-dark-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, or type..."
            className="w-full bg-neutral-900 border border-dark-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          {['all', 'cut', 'in_progress', 'pending', 'waste'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setFilter(statusKey)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-colors ${
                filter === statusKey
                  ? 'bg-neutral-800 text-white border border-neutral-600'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {statusKey.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Table */}
      <div className="card-surface border border-dark-border bg-dark-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 border-b border-dark-border font-mono text-[11px] text-neutral-400 uppercase">
              <tr>
                <th className="py-3.5 px-4">Part ID</th>
                <th className="py-3.5 px-4">Component Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Weight (kg)</th>
                <th className="py-3.5 px-4">Thickness</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-neutral-500 font-mono">
                    No structural parts match the current filter.
                  </td>
                </tr>
              ) : (
                filteredParts.map((p) => (
                  <tr key={p._id || p.partId} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-accent-cyan">
                      {p.partId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{p.name}</td>
                    <td className="py-3.5 px-4 text-neutral-400">{p.type}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">
                      {p.weight?.toLocaleString()} kg
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-400">
                      {p.thickness ? `${p.thickness} mm` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`badge font-mono text-[10px] uppercase ${
                          p.status === 'cut'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'in_progress'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                            : p.status === 'waste'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {p.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 max-w-xs truncate">
                      {p.notes || 'Clean thermal cut trajectory'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Part Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full border border-neutral-700 bg-neutral-950">
            <h3 className="text-base font-bold text-white mb-1">Register Structural Ship Part</h3>
            <p className="text-xs text-text-secondary mb-4">Add a hull segment or beam into the autonomous cutting queue.</p>

            <form onSubmit={handleAddPart} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-text-secondary mb-1">PART IDENTIFIER *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HULL-P-205"
                  value={newPart.partId}
                  onChange={(e) => setNewPart({ ...newPart, partId: e.target.value })}
                  className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-secondary mb-1">PART NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Longitudinal Stringer Beam 12"
                  value={newPart.name}
                  onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">TYPE</label>
                  <select
                    value={newPart.type}
                    onChange={(e) => setNewPart({ ...newPart, type: e.target.value })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white"
                  >
                    <option value="Hull Plate">Hull Plate</option>
                    <option value="Deck Beam">Deck Beam</option>
                    <option value="Bulkhead">Bulkhead</option>
                    <option value="Pipe">Pipe</option>
                    <option value="Keel Segment">Keel Segment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">STATUS</label>
                  <select
                    value={newPart.status}
                    onChange={(e) => setNewPart({ ...newPart, status: e.target.value })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="cut">Cut</option>
                    <option value="waste">Waste</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">WEIGHT (KG)</label>
                  <input
                    type="number"
                    value={newPart.weight}
                    onChange={(e) => setNewPart({ ...newPart, weight: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-secondary mb-1">THICKNESS (MM)</label>
                  <input
                    type="number"
                    value={newPart.thickness}
                    onChange={(e) => setNewPart({ ...newPart, thickness: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-secondary mb-1">NOTES</label>
                <input
                  type="text"
                  placeholder="Metallurgical grade, bevel spec, or torch speed"
                  value={newPart.notes}
                  onChange={(e) => setNewPart({ ...newPart, notes: e.target.value })}
                  className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-xs text-white"
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
                  Save Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
