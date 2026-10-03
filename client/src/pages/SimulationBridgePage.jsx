import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Cpu,
  Flame,
  Radio,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  RefreshCw,
  Layers,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Link as LinkIcon
} from 'lucide-react';

export default function SimulationBridgePage() {
  const [telemetry, setTelemetry] = useState(null);
  const [safety, setSafety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulationUrl, setSimulationUrl] = useState(
    localStorage.getItem('SIMULATION_URL') || 'https://threejs.org/examples/webgl_animation_skinning_blending.html'
  );
  const [inputUrl, setInputUrl] = useState(simulationUrl);
  const [embedLoaded, setEmbedLoaded] = useState(false);

  const fetchLiveState = async () => {
    try {
      const res = await api.getLiveSensors();
      setTelemetry(res.telemetry);
      setSafety(res.safety);
    } catch (err) {
      console.error('Failed to load safety state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    setSimulationUrl(inputUrl);
    localStorage.setItem('SIMULATION_URL', inputUrl);
  };

  const handleToggleHazard = async () => {
    try {
      await api.toggleHazardSimulation();
      fetchLiveState();
    } catch (err) {
      alert('Error triggering simulation hazard: ' + err.message);
    }
  };

  if (loading && !telemetry) return <LoadingSpinner text="Connecting to Robotic Safety Interlock Engine..." />;

  const isSafe = safety?.isSafeToCut;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent-cyan" />
            <h2 className="text-xl font-bold text-white">Robot Cutting Simulation & Safety Signal Bridge</h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Automated sensor decision engine: verifies opposite compartment gas levels and temperatures before authorizing robotic cutting.
          </p>
        </div>

        {/* Hazard injection quick test */}
        <button
          onClick={handleToggleHazard}
          className={`btn-primary text-xs font-mono py-2 px-4 shadow-glow ${
            isSafe ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-emerald-400 text-black hover:bg-emerald-300'
          }`}
        >
          {isSafe ? 'Simulate Gas Leak on Opposite Side (Test Red Signal)' : 'Clear Opposite Gas (Test Green Signal)'}
        </button>
      </div>

      {/* Main Signal Display HUD */}
      <div
        className={`p-6 rounded-2xl border transition-all duration-500 shadow-2xl ${
          isSafe
            ? 'bg-gradient-to-r from-emerald-950/60 via-neutral-950 to-neutral-950 border-emerald-500/70'
            : 'bg-gradient-to-r from-red-950/70 via-neutral-950 to-neutral-950 border-red-500/80 animate-pulse'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Big LED Signal Light */}
            <div
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border shrink-0 ${
                isSafe
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)]'
                  : 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_40px_rgba(244,63,94,0.6)]'
              }`}
            >
              {isSafe ? (
                <ShieldCheck className="w-10 h-10 animate-pulse" />
              ) : (
                <AlertOctagon className="w-10 h-10 animate-bounce" />
              )}
              <span className="text-[9px] font-mono font-bold mt-1 uppercase">
                {isSafe ? 'GREEN' : 'RED'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`badge font-mono text-xs uppercase px-2.5 py-0.5 ${
                    isSafe
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {isSafe ? 'CUT AUTHORIZATION GRANTED' : 'SAFETY INHIBIT TRIGGERED'}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  SIGNAL CODE: {safety?.signal}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mt-1.5">
                {isSafe ? 'OPPOSITE AREA SAFE TO CUT' : 'DANGER: VOLATILE GAS DETECTED IN REVERSE COMPARTMENT'}
              </h3>

              <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                {isSafe
                  ? 'Reverse hull void has zero combustible hydrocarbon fumes and temperature is under 50°C. Robot cut trajectory is unlocked.'
                  : 'Harmful flammable vapor detected behind bulkhead plate. Plasma torch ignition is electronically locked to prevent explosion.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 text-right">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">SAFETY CLEARANCE</span>
            <span className={`text-3xl font-black font-mono ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
              {safety?.safetyScore}%
            </span>
            <span className="text-[11px] font-mono text-neutral-500 mt-1">
              Evaluated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Compartment Cross-Section Diagram (Forward Cut Face vs Reverse Void) */}
      <div className="card-surface p-6 border border-dark-border bg-dark-card">
        <h3 className="text-xs font-mono font-bold text-white uppercase border-b border-dark-border pb-3 mb-5 flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-cyan" />
          <span>Cross-Section Ship Bulkhead Inspection Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Side 1: Forward Cutting Face (Robot Side) */}
          <div className="p-5 rounded-xl bg-neutral-950 border border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-cyan-400">SIDE A: CUTTING FACE (ROBOT SIDE)</span>
              <span className="badge bg-neutral-800 text-neutral-300 font-mono text-[10px]">PLASMA ACTIVE</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400 border-b border-neutral-800/80 pb-1">
                <span>Surface Plate Temp:</span>
                <span className="text-orange-400 font-bold">{telemetry?.temperature}°C</span>
              </div>
              <div className="flex justify-between text-neutral-400 border-b border-neutral-800/80 pb-1">
                <span>Standoff Gap:</span>
                <span className="text-white">{telemetry?.distanceMM} mm</span>
              </div>
              <div className="flex justify-between text-neutral-400 pb-1">
                <span>Ambient Air Status:</span>
                <span className="text-emerald-400">Normal Oxygen Mix</span>
              </div>
            </div>
          </div>

          {/* Side 2: Opposite Reverse Compartment (Hazard Check Side) */}
          <div
            className={`p-5 rounded-xl border space-y-3 ${
              isSafe ? 'bg-neutral-950 border-emerald-900/60' : 'bg-red-950/40 border-red-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-mono ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                SIDE B: REVERSE COMPARTMENT (VOID / TANK)
              </span>
              <span
                className={`badge font-mono text-[10px] uppercase ${
                  isSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {isSafe ? 'VERIFIED CLEAR' : 'HAZARDOUS ATMOSPHERE'}
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400 border-b border-neutral-800/80 pb-1">
                <span>Reverse Wall Temperature:</span>
                <span className={telemetry?.oppositeSideTemp > 50 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {telemetry?.oppositeSideTemp}°C {telemetry?.oppositeSideTemp > 50 ? '(TOO HOT)' : '(SAFE < 50°C)'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400 border-b border-neutral-800/80 pb-1">
                <span>Volatile Gas Concentration:</span>
                <span className={telemetry?.oppositeSideGasPPM > 35 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {telemetry?.oppositeSideGasPPM} PPM {telemetry?.oppositeSideGasPPM > 35 ? '(EXPLOSION HAZARD)' : '(SAFE < 35 PPM)'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400 pb-1">
                <span>Detected Vapor Classification:</span>
                <span className={isSafe ? 'text-neutral-300' : 'text-red-300 font-bold'}>
                  {telemetry?.toxicGasType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Simulation Website Connector & Live Preview */}
      <div className="card-surface p-6 border border-dark-border bg-dark-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-border pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-accent-cyan" />
              <span>Connect External 3D Robot Simulation Website</span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Embed your deployed 3D simulation website here or configure its target URL.
            </p>
          </div>

          <a
            href={simulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs flex items-center gap-1.5 self-start"
          >
            <span>Open Simulation in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleSaveUrl} className="flex gap-2 text-xs">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://your-robot-simulation.onrender.com or vercel.app"
            className="flex-1 bg-neutral-900 border border-dark-border rounded-lg px-3 py-2 text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-neutral-400"
          />
          <button type="submit" className="btn-primary text-xs px-5">
            Update Embed
          </button>
        </form>

        {/* Embedded Simulation Iframe */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-neutral-800 bg-black">
          <iframe
            src={simulationUrl}
            title="Robot Cutting Simulation"
            className="w-full h-full border-0"
            allow="fullscreen; accelerometer; gyroscope"
            onLoad={() => setEmbedLoaded(true)}
          />
          {/* Overlay HUD with live signal */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-neutral-700 text-xs font-mono flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSafe ? 'bg-emerald-400 animate-ping' : 'bg-red-400 animate-bounce'}`} />
            <span className={isSafe ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              SIMULATION CUT SIGNAL: {isSafe ? 'UNLOCKED (GREEN)' : 'INHIBITED (RED)'}
            </span>
          </div>
        </div>

        {/* API Bridge Documentation */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-dark-border font-mono text-xs space-y-2">
          <div className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>How your simulation website reads the cutting authorization</span>
          </div>
          <p className="text-neutral-400 text-[11px]">
            In your simulation script, fetch our real-time endpoint:
          </p>
          <pre className="bg-black p-3 rounded text-[11px] text-emerald-400 overflow-x-auto border border-neutral-800">
{`// Query cutting authorization in your 3D robot simulation:
fetch('http://YOUR_SERVER_URL/api/sensors/live')
  .then(res => res.json())
  .then(data => {
    if (data.safety.isSafeToCut) {
      robot.triggerPlasmaCutAnimation();
      setLedColor('#00ff00'); // Green Light
    } else {
      robot.haltCutTrajectory();
      setLedColor('#ff0000'); // Red Light
      alert('Hazard in opposite compartment: ' + data.safety.reasons[0]);
    }
  });`}
          </pre>
        </div>
      </div>
    </div>
  );
}
