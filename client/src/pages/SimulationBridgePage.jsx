import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Layers,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Gauge,
  ArrowRight,
  Code,
  Terminal,
  Activity
} from 'lucide-react';

export default function SimulationBridgePage() {
  const [telemetry, setTelemetry] = useState(null);
  const [safety, setSafety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenCounter, setTokenCounter] = useState(1048);

  const fetchLiveState = async () => {
    try {
      const res = await api.getLiveSensors();
      setTelemetry(res.telemetry);
      setSafety(res.safety);
      setTokenCounter((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to load safety state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleHazard = async () => {
    try {
      await api.toggleHazardSimulation();
      fetchLiveState();
    } catch (err) {
      alert('Error triggering safety hazard: ' + err.message);
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
            <Zap className="w-5 h-5 text-accent-cyan animate-pulse" />
            <h2 className="text-xl font-bold text-white">Safety Interlock Bridge & Decision Engine</h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Automated cyber-physical sensor gate: verifies opposite compartment gas levels, stand-off gap, and temperature before permitting plasma arc ignition.
          </p>
        </div>

        {/* Hazard injection quick test */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleHazard}
            className={`btn-primary text-xs font-mono py-2 px-4 shadow-glow ${
              isSafe ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-emerald-400 text-black hover:bg-emerald-300'
            }`}
          >
            {isSafe ? 'Simulate Gas Leak (Test Red Inhibit)' : 'Purge Gas Hazard (Test Green Permit)'}
          </button>
        </div>
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
                  CODE: {safety?.signal}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mt-1.5">
                {isSafe ? 'OPPOSITE AREA SAFE TO CUT' : 'DANGER: VOLATILE GAS DETECTED IN REVERSE COMPARTMENT'}
              </h3>

              <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                {isSafe
                  ? 'Reverse hull void has zero combustible hydrocarbon fumes and temperature is under 50°C. Robot cut trajectory is authorized.'
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
              Token: #AUTH-TTN-{tokenCounter}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Telemetry Metrics Driving Interlock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Reverse Wall Temperature"
          value={`${telemetry?.oppositeSideTemp || 28.5}°C`}
          unit={`Max Allowed: ${safety?.thresholds?.maxOppositeTemp || 50}°C`}
          icon={Thermometer}
          change={telemetry?.oppositeSideTemp > 50 ? 'CRITICAL HEAT' : 'Safe Wall Temp'}
          changeType={telemetry?.oppositeSideTemp > 50 ? 'negative' : 'positive'}
        />

        <StatsCard
          title="Volatile Gas in Void"
          value={`${telemetry?.oppositeSideGasPPM || 8.2} PPM`}
          unit={`Max Safe: ${safety?.thresholds?.maxGasPPM || 35} PPM`}
          icon={Flame}
          change={telemetry?.oppositeSideGasPPM > 35 ? 'EXPLOSION RISK' : 'Inert Atmosphere'}
          changeType={telemetry?.oppositeSideGasPPM > 35 ? 'negative' : 'positive'}
          subtitle={`Vapor: ${telemetry?.toxicGasType || 'Clean Air'}`}
        />

        <StatsCard
          title="Torch Standoff Gap"
          value={`${telemetry?.distanceMM || 40.0} mm`}
          unit="Calibrated Window: 40 mm"
          icon={Gauge}
          change="Ultrasonic THC Verified"
          changeType="positive"
        />

        <StatsCard
          title="Cutting Permit Status"
          value={isSafe ? 'PERMIT ACTIVE' : 'LOCKED OUT'}
          unit={isSafe ? 'Relay Open 🟢' : 'Relay Tripped 🔴'}
          icon={ShieldCheck}
          change={isSafe ? 'Cutting Ready' : 'Emergency Stop'}
          changeType={isSafe ? 'positive' : 'negative'}
        />
      </div>

      {/* Cross-Section Bulkhead Inspection Telemetry */}
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
                <span className="text-orange-400 font-bold">{telemetry?.temperature || 27.6}°C</span>
              </div>
              <div className="flex justify-between text-neutral-400 border-b border-neutral-800/80 pb-1">
                <span>Standoff Gap:</span>
                <span className="text-white">{telemetry?.distanceMM || 40.0} mm</span>
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
                  {telemetry?.oppositeSideTemp || 28.5}°C {telemetry?.oppositeSideTemp > 50 ? '(TOO HOT)' : '(SAFE < 50°C)'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400 border-b border-neutral-800/80 pb-1">
                <span>Volatile Gas Concentration:</span>
                <span className={telemetry?.oppositeSideGasPPM > 35 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {telemetry?.oppositeSideGasPPM || 8.2} PPM {telemetry?.oppositeSideGasPPM > 35 ? '(EXPLOSION HAZARD)' : '(SAFE < 35 PPM)'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400 pb-1">
                <span>Detected Vapor Classification:</span>
                <span className={isSafe ? 'text-neutral-300' : 'text-red-300 font-bold'}>
                  {telemetry?.toxicGasType || 'None (Clean Air)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live REST / WebSocket Interlock Signal Payload */}
      <div className="card-surface p-6 border border-dark-border bg-dark-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-border pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent-cyan" />
              <span>Real-Time Authorization Payload (Dispatched to Robot Controller)</span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Target receiver: Deployed RoboFest Command Center & Onboard Crawler Microcontroller
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono text-emerald-400">BROADCASTING AT 2.5 HZ</span>
          </div>
        </div>

        <pre className="bg-black p-4 rounded-xl border border-neutral-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
{JSON.stringify(
  {
    bridgeStatus: 'ONLINE_ACTIVE',
    signal: safety?.signal || 'SIGNAL_AUTHORIZED_GREEN',
    isSafeToCut: isSafe,
    safetyScore: safety?.safetyScore || 98,
    reasons: safety?.reasons || ['All parameters within safe cutting threshold'],
    evaluatedAt: new Date().toISOString(),
    telemetry: {
      temperatureTorch: telemetry?.temperature || 27.6,
      oppositeWallTemp: telemetry?.oppositeSideTemp || 28.5,
      oppositeSideGasPPM: telemetry?.oppositeSideGasPPM || 8.2,
      standoffDistanceMM: telemetry?.distanceMM || 40.0,
      vaporClassification: telemetry?.toxicGasType || 'Clean Air',
    },
    interlockRelay: isSafe ? 'RELAY_CLOSED_CURRENT_FLOW' : 'RELAY_OPEN_DISCHARGED',
    permitTarget: 'https://robo-fest-self.vercel.app/command-center',
  },
  null,
  2
)}
        </pre>

        {/* Quick Link Banner to Ship Cutting Simulations */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-white font-semibold block">Need to view the live 3D robot cutter or RoboFest Command Center?</span>
            <span className="text-neutral-400 text-[11px] block mt-0.5">
              The 3D kinematics simulator and deployed website are located in their dedicated column.
            </span>
          </div>
          <Link
            to="/dashboard/ship-cutting-simulations"
            className="btn-primary text-xs flex items-center gap-2 font-mono whitespace-nowrap self-start sm:self-center"
          >
            <span>Open Ship Cutting Simulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
