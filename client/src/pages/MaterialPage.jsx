import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PieChart, ShieldAlert, Award, Layers, FlaskConical, CheckCircle2 } from 'lucide-react';

export default function MaterialPage() {
  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await api.getMaterials();
        setMaterials(data);
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  if (loading) return <LoadingSpinner text="Analyzing spectrometry data..." />;

  const mat = materials || {
    sampleBatchId: 'BATCH-2026-MAT-77',
    composition: { steel: 78.5, iron: 12.2, aluminum: 4.8, copper: 2.7, other: 1.8 },
    totalWeight: 19350,
    grade: 'Marine Grade AH36 / Mild Steel Mix',
    corrosionLevel: 'Moderate',
    recyclabilityScore: 94.6,
    conditionNotes: 'Optimal for electric arc furnace smelting. Minimal composite contaminants.',
  };

  const comp = mat.composition || {};

  const compositionItems = [
    { label: 'Marine Structural Steel', percent: comp.steel || 78.5, color: '#38bdf8', tons: '15,190 T' },
    { label: 'Cast & Scrap Iron', percent: comp.iron || 12.2, color: '#94a3b8', tons: '2,360 T' },
    { label: 'Superstructure Aluminum', percent: comp.aluminum || 4.8, color: '#e0e0e0', tons: '928 T' },
    { label: 'Copper / Bronze Alloy', percent: comp.copper || 2.7, color: '#f59e0b', tons: '522 T' },
    { label: 'Insulation & Trace Residue', percent: comp.other || 1.8, color: '#f43f5e', tons: '348 T' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-xl font-bold text-white">Vessel Material Spectrometry & Alloy Analysis</h2>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Optical emission spectrometry (OES) analysis of dismantled metal sections for maximum scrap resale yield.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Recoverable Metal"
          value={mat.totalWeight?.toLocaleString()}
          unit="metric tons"
          icon={Layers}
        />
        <StatsCard
          title="Recyclability Score"
          value={`${mat.recyclabilityScore}%`}
          change="Tier 1 Circular"
          changeType="positive"
          icon={Award}
        />
        <StatsCard
          title="Surface Oxidation / Rust"
          value={mat.corrosionLevel}
          subtitle="Passes blast cleaning standard"
          icon={ShieldAlert}
        />
        <StatsCard
          title="Primary Alloy Grade"
          value="AH36 Steel"
          subtitle="Yield strength: 355 MPa"
          icon={CheckCircle2}
        />
      </div>

      {/* Composition Breakdown Bars & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Progress bar composition breakdown */}
        <div className="lg:col-span-2 card-surface p-6 border border-dark-border bg-dark-card">
          <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-6">
            <h3 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
              Spectrometry Chemical Composition (%)
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">BATCH: {mat.sampleBatchId}</span>
          </div>

          {/* Stacked multi-color bar */}
          <div className="w-full h-8 rounded-lg overflow-hidden flex mb-8 bg-neutral-900 border border-dark-border">
            {compositionItems.map((item) => (
              <div
                key={item.label}
                title={`${item.label}: ${item.percent}%`}
                style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-500 hover:opacity-80"
              />
            ))}
          </div>

          {/* List items */}
          <div className="space-y-4">
            {compositionItems.map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-lg bg-neutral-950/70 border border-dark-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: item.color }} />
                  <div>
                    <h4 className="text-xs font-semibold text-white">{item.label}</h4>
                    <span className="text-[10px] font-mono text-neutral-400">Estimated: {item.tons}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-white">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col: Smelter Quality Certificate */}
        <div className="card-surface p-6 border border-dark-border bg-dark-card flex flex-col justify-between">
          <div>
            <div className="border-b border-dark-border pb-3 mb-4">
              <h3 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
                Electric Arc Furnace (EAF) Suitability
              </h3>
              <span className="text-[11px] text-emerald-400 font-mono">CERTIFIED SCRAP GRADE</span>
            </div>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="p-3 rounded-lg bg-neutral-950 border border-dark-border">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                  Chemical Purity
                </span>
                <p className="leading-relaxed">
                  Sulfur and phosphorus contaminants measured below 0.035%, suitable for direct re-rolling into construction rebar and structural wide-flange I-beams.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-dark-border">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                  Hazardous Coatings
                </span>
                <p className="leading-relaxed">
                  Lead paint and TBT antifouling coatings were thermally stripped by plasma auxiliary blower prior to plate separation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-dark-border">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                  Condition Notes
                </span>
                <p className="leading-relaxed text-text-secondary">
                  {mat.conditionNotes}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border text-center">
            <button
              onClick={() => alert('Spectrometry batch PDF report exported to workspace.')}
              className="btn-secondary w-full text-xs font-mono"
            >
              Export Metallurgical Certificate (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
