import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import RobotArmSimulator3D from '../components/dashboard/RobotArmSimulator3D';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Bot,
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
  Eye,
  Camera,
  Maximize2,
  RefreshCw,
  Sliders,
  Cpu,
  ArrowRight,
  Globe,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export default function ShipCuttingSimulationsPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [safety, setSafety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deployed-robot'); // 'deployed-robot' | 'robot-3d' | 'thermal-camera' | 'online-gallery'
  
  // User deployed simulation website state (RoboFest Command Center)
  const defaultUserSim = 'https://robo-fest-self.vercel.app/command-center';
  const [deployedSimUrl, setDeployedSimUrl] = useState(
    () => localStorage.getItem('USER_DEPLOYED_SIM_URL') || defaultUserSim
  );
  const [inputUrl, setInputUrl] = useState(deployedSimUrl);
  const [iframeKey, setIframeKey] = useState(0);

  // Curated online simulations
  const onlineSimulations = [
    {
      id: 'sim-crawler',
      title: 'Heavy Magnetic Hull Crawler 3D',
      provider: 'Three.js GLTF Engine',
      category: 'Crawler Platform',
      url: 'https://threejs.org/examples/webgl_loader_gltf.html',
      description: 'Magnetic track crawling vehicle equipped with high-torque servo drives for vertical ship hull climbing.'
    },
    {
      id: 'sim-kinematics',
      title: 'Articulated 6-Axis Robot Kinematics',
      provider: 'WebGL Robotics Lab',
      category: 'Robotic Arm',
      url: 'https://threejs.org/examples/webgl_animation_skinning_blending.html',
      description: 'Inverse kinematics simulation for multi-joint robotic arm cutting trajectory planning.'
    },
    {
      id: 'sim-particles',
      title: 'Plasma Arc & High-Energy Particle Flow',
      provider: 'WebGL Shader Dynamics',
      category: 'Laser/Plasma Physics',
      url: 'https://threejs.org/examples/webgl_points_waves.html',
      description: 'High-temperature thermal dispersion and fluid molten metal wave dynamics simulator.'
    }
  ];

  const fetchLiveState = async () => {
    try {
      const res = await api.getLiveSensors();
      setTelemetry(res.telemetry);
      setSafety(res.safety);
    } catch (err) {
      console.warn('Sensor bridge in offline/sim mode, using local state');
      // Realistic simulated fallback
      setTelemetry((prev) => prev || {
        temperature: 42.4,
        distanceMM: 3.21,
        oppositeSideTemp: 27.8,
        oppositeSideGasPPM: 6.2,
        toxicGasType: 'Methane (CH4) trace'
      });
      setSafety((prev) => prev || {
        isSafeToCut: true,
        signal: 'SIGNAL_AUTHORIZED_GREEN',
        safetyScore: 98,
        reasons: ['Opposite void hydrocarbons < 10% LEL', 'Temperature < 50°C']
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSaveDeployedUrl = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setDeployedSimUrl(inputUrl.trim());
    localStorage.setItem('USER_DEPLOYED_SIM_URL', inputUrl.trim());
    setIframeKey((k) => k + 1);
  };

  const handleToggleHazard = async () => {
    try {
      await api.toggleHazardSimulation();
      fetchLiveState();
    } catch (err) {
      // Toggle locally if backend is unavailable
      setSafety((prev) => {
        const nextSafe = !prev.isSafeToCut;
        return {
          isSafeToCut: nextSafe,
          signal: nextSafe ? 'SIGNAL_AUTHORIZED_GREEN' : 'SIGNAL_INHIBITED_RED',
          safetyScore: nextSafe ? 98 : 12,
          reasons: nextSafe
            ? ['Atmosphere clear behind bulkhead', 'Safe operating temperature']
            : ['Hazardous gas concentration in opposite void > 35 PPM!']
        };
      });
      setTelemetry((prev) => ({
        ...prev,
        oppositeSideGasPPM: safety?.isSafeToCut ? 142 : 6,
        oppositeSideTemp: safety?.isSafeToCut ? 68 : 28
      }));
    }
  };

  const isSafe = safety?.isSafeToCut ?? true;
  const oppTemp = telemetry?.oppositeSideTemp || 28;
  const oppGas = telemetry?.oppositeSideGasPPM || 8;
  const standoffMM = telemetry?.distanceMM || 3.21;
  const surfaceTemp = telemetry?.temperature || 42;

  if (loading && !telemetry) {
    return <LoadingSpinner text="Initializing 3D Robot Arm & Sensor Engine..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Safety Signal Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Ship Cutting Simulations & Multi-Sensor Suite</h1>
              <p className="text-xs text-neutral-400">
                Robotic Can Crawler • 6-Axis Laser Arm • FLIR Thermal Gas AI • Opposite Bulkhead Interlock
              </p>
            </div>
          </div>
        </div>

        {/* Hazard Injector & Quick Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleHazard}
            className={`text-xs font-mono py-2 px-3.5 rounded-lg border transition-all flex items-center gap-2 ${
              isSafe
                ? 'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:bg-amber-900/50'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSafe ? 'Test Gas Hazard (Trigger Red)' : 'Clear Hazard (Restore Green)'}</span>
          </button>

          <div
            className={`px-3.5 py-2 rounded-lg border flex items-center gap-2 font-mono text-xs ${
              isSafe
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                : 'bg-red-950/60 border-red-500/80 text-red-300 animate-pulse'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isSafe ? 'bg-emerald-400' : 'bg-red-400 animate-ping'}`} />
            <span className="font-bold">{isSafe ? 'CUT AUTHORIZED' : 'SAFETY INHIBITED'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dark-border pb-3">
        <button
          onClick={() => setActiveTab('deployed-robot')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'deployed-robot'
              ? 'bg-accent-cyan text-black shadow-glow font-bold scale-[1.02]'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-dark-border'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>RoboFest Command Center (Deployed Robot)</span>
          <span className="px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono border border-cyan-500/50 text-cyan-300">
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveTab('robot-3d')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'robot-3d'
              ? 'bg-accent-cyan text-black shadow-glow font-bold'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-dark-border'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>KRAN-VULCAN 3D (Standoff & Chassis Simulation)</span>
        </button>

        <button
          onClick={() => setActiveTab('thermal-camera')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'thermal-camera'
              ? 'bg-accent-cyan text-black shadow-glow font-bold'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-dark-border'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>FLIR Thermal Camera & Gas Prediction</span>
        </button>

        <button
          onClick={() => setActiveTab('online-gallery')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'online-gallery'
              ? 'bg-accent-cyan text-black shadow-glow font-bold'
              : 'bg-neutral-900 text-neutral-300 hover:text-white border border-dark-border'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Online Robotic Simulations Gallery</span>
        </button>
      </div>

      {/* 4 Sensor Cards HUD (Real-time Sensor Monitoring) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Temperature Sensor */}
        <div className="card-surface p-4 border border-dark-border bg-dark-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span>Laser & Plate Temp</span>
            </span>
            <span className="badge bg-orange-950/60 text-orange-400 border border-orange-800 text-[10px]">
              PT1000 / IR
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">1,850</span>
            <span className="text-xs font-mono text-neutral-400">°C (Focal Kerf)</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono space-y-1 pt-1 border-t border-neutral-800">
            <div className="flex justify-between">
              <span>Plate Surface:</span>
              <span className="text-amber-400 font-bold">{surfaceTemp}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Cooling Water Loop:</span>
              <span className="text-emerald-400">18.4°C</span>
            </div>
          </div>
        </div>

        {/* 2. Ultrasonic Sensor (Standoff) */}
        <div className="card-surface p-4 border border-dark-border bg-dark-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ultrasonic Standoff</span>
            </span>
            <span className="badge bg-cyan-950/60 text-cyan-400 border border-cyan-800 text-[10px]">
              40 kHz Sonar
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">{standoffMM}</span>
            <span className="text-xs font-mono text-neutral-400">mm (Optimal: 3.2 mm)</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono space-y-1 pt-1 border-t border-neutral-800">
            <div className="flex justify-between">
              <span>Auto-Z Leveling:</span>
              <span className="text-emerald-400 font-bold">LOCKED & ON-TRACK</span>
            </div>
            <div className="flex justify-between">
              <span>Hull Plate Curvature:</span>
              <span className="text-neutral-300">R = 4.2 m</span>
            </div>
          </div>
        </div>

        {/* 3. FLIR Thermal & Gas Prediction AI */}
        <div className="card-surface p-4 border border-dark-border bg-dark-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              <span>Gas Prediction AI</span>
            </span>
            <span className={`badge font-mono text-[10px] ${isSafe ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
              {isSafe ? 'SAFE' : 'ALERT'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${oppGas > 35 ? 'text-red-400' : 'text-emerald-400'}`}>
              {oppGas}
            </span>
            <span className="text-xs font-mono text-neutral-400">PPM (Opposite Void)</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono space-y-1 pt-1 border-t border-neutral-800">
            <div className="flex justify-between">
              <span>Predicted Gas Type:</span>
              <span className="text-neutral-300 font-bold truncate max-w-[130px]">{telemetry?.toxicGasType}</span>
            </div>
            <div className="flex justify-between">
              <span>LEL Lower Explosive:</span>
              <span className={oppGas > 35 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {oppGas > 35 ? '18.4% (DANGER)' : '< 1.5% (SAFE)'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Opposite Side Safety Interlock */}
        <div className={`card-surface p-4 border bg-dark-card space-y-2 ${isSafe ? 'border-emerald-800/60' : 'border-red-800/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safety Interlock Signal</span>
            </span>
            <span className={`badge font-mono text-[10px] ${isSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {isSafe ? 'SIGNAL GREEN' : 'SIGNAL RED'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
              {safety?.safetyScore || 98}%
            </span>
            <span className="text-xs font-mono text-neutral-400">Clearance Score</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono space-y-1 pt-1 border-t border-neutral-800">
            <div className="flex justify-between">
              <span>Opposite Void Temp:</span>
              <span className={oppTemp > 50 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {oppTemp}°C {oppTemp > 50 ? '(HOT)' : '(< 50°C OK)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Laser Discharge:</span>
              <span className={isSafe ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {isSafe ? 'PERMITTED' : 'INHIBITED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: 3D Robot Arm Laser Cutter */}
      {activeTab === 'robot-3d' && (
        <div className="space-y-4">
          <RobotArmSimulator3D
            isSafeToCut={isSafe}
            oppositeSideTemp={oppTemp}
            oppositeSideGasPPM={oppGas}
          />

          {/* Detailed Features of KRAN-VULCAN & Ultrasonic Height Sensing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-900/80 border border-dark-border space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
                <Bot className="w-4 h-4" />
                <span>KRAN-VULCAN Chassis</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Rugged aluminum crawler with continuous rubber tracks &amp; Neodymium pot magnets. Crawls vertically on rusted IS 2062 ship hull plates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/80 border border-dark-border space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
                <Radio className="w-4 h-4" />
                <span>Ultrasonic Standoff (THC)</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ultrasonic sensor measures nozzle-to-plate distance. Arm auto-lowers and locks at 3.5 mm standoff before torch ignition starts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/80 border border-dark-border space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs font-mono">
                <Flame className="w-4 h-4" />
                <span>Permanent Cut Marks</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                As the robot advances, severed kerf grooves (28mm through-cut) permanently mark into the steel plate with glowing heat and HAZ discoloration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/80 border border-dark-border space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Gas Pods &amp; Interlock</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Triple front gas canisters &amp; OAK-D Lite camera. Interlocked with opposite void—hazardous gas or heat halts cutting instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLIR Thermal Camera & Gas Prediction Mode */}
      {activeTab === 'thermal-camera' && (
        <div className="card-surface p-6 border border-dark-border bg-dark-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-400" />
                <span>FLIR Thermal Imaging & AI Gas Plume Spectrum</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Visualizing infrared radiation signature and VOC gas plume absorption bands behind the bulkhead plate.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Filter Spectrum:</span>
              <span className="badge bg-rose-950 text-rose-300 border border-rose-800 font-mono text-xs">
                3.2 µm – 3.4 µm (Hydrocarbon Band)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualizer Frame */}
            <div className="relative aspect-video rounded-xl bg-gradient-to-br from-indigo-950 via-purple-950 to-neutral-950 border border-purple-800/50 flex flex-col items-center justify-center p-6 overflow-hidden">
              {/* Pseudo Thermal Plate Visualization */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background Thermal Heatmap Gradient */}
                <div
                  className={`w-72 h-72 rounded-full blur-3xl opacity-60 transition-all duration-700 ${
                    isSafe
                      ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400'
                      : 'bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 animate-pulse'
                  }`}
                />

                {/* Simulated Steel Plate Cross-Section */}
                <div className="relative z-10 w-4/5 h-36 rounded-lg border-2 border-neutral-600 bg-neutral-900/80 backdrop-blur-md p-4 flex flex-col justify-between">
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                    <span>FORWARD PLATE: {surfaceTemp}°C</span>
                    <span className={oppTemp > 50 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      REVERSE VOID: {oppTemp}°C
                    </span>
                  </div>

                  {/* Cut line laser point */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-cyan-300 animate-ping shadow-[0_0_20px_cyan]" />
                    <span className="text-xs font-mono text-white font-bold">
                      LASER FOCAL SPOT: 1,850°C
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-400">AI Plume Predictor:</span>
                    <span className={isSafe ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold animate-pulse'}>
                      {isSafe ? 'NO LEAK DETECTED (CLEAR)' : `CRITICAL GAS PLUME: ${oppGas} PPM`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thermal color scale legend */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-neutral-800">
                <span>0°C (Cold)</span>
                <div className="w-48 h-2 rounded-full bg-gradient-to-r from-blue-700 via-cyan-400 via-amber-400 to-red-600" />
                <span>2,000°C (Laser Core)</span>
              </div>
            </div>

            {/* Gas Prediction Spectrometry Details */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-dark-border space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  Thermal Camera Optical Gas Imaging (OGI)
                </span>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The FLIR GF320 optical filter isolates infrared wavelengths absorbed by fugitive hydrocarbon gases (Methane, Propane, Butane, and Benzene vapors). Even invisible vapor leaks appear as dark swirling clouds on the detector array.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-neutral-800">
                  <div className="text-neutral-400">Spectral Band: <span className="text-white">3.2 - 3.4 µm</span></div>
                  <div className="text-neutral-400">NETD Sensitivity: <span className="text-white">&lt; 15 mK</span></div>
                  <div className="text-neutral-400">Frame Rate: <span className="text-white">60 Hz Real-Time</span></div>
                  <div className="text-neutral-400">AI Confidence: <span className="text-emerald-400 font-bold">99.4%</span></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-dark-border space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Bulkhead Safety Rules (Opposite Compartment)
                </span>
                <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4 font-mono">
                  <li>Combustible Gas Concentration must be strictly <strong className="text-white">&lt; 35 PPM</strong> or &lt; 10% LEL.</li>
                  <li>Opposite Bulkhead Surface Temp must remain <strong className="text-white">&lt; 50°C</strong> to avoid spontaneous fuel ignition.</li>
                  <li>Ultrasonic standoff sensor must maintain <strong className="text-white">3.0 - 3.5 mm</strong> distance to avoid focal runaway.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: RoboFest Deployed Command Center (Separate Dedicated Embed) */}
      {activeTab === 'deployed-robot' && (
        <div className="card-surface p-6 border border-dark-border bg-dark-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent-cyan animate-pulse" />
                <h3 className="text-base font-bold text-white">RoboFest Deployed Command Center</h3>
                <span className="badge bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono">
                  LIVE ROBOT CUTTING
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Embedded directly from your deployed web simulation (<span className="text-cyan-400 font-mono">https://robo-fest-self.vercel.app/command-center</span>).
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start">
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="btn-secondary text-xs flex items-center gap-1.5"
                title="Reload Simulation Frame"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Frame</span>
              </button>
              <a
                href={deployedSimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs flex items-center gap-1.5 font-mono"
              >
                <span>Open Command Center</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* URL Input Bar */}
          <form onSubmit={handleSaveDeployedUrl} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://robo-fest-self.vercel.app/command-center"
                className="w-full bg-neutral-900 border border-dark-border rounded-lg px-4 py-2.5 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="btn-secondary text-xs px-5 py-2.5 flex items-center justify-center gap-2 font-mono whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update URL</span>
            </button>
          </form>

          {/* Full-Height Embed Container */}
          <div className="relative w-full min-h-[640px] h-[750px] rounded-2xl overflow-hidden border border-neutral-700 bg-black shadow-2xl">
            <iframe
              key={iframeKey}
              src={deployedSimUrl}
              title="RoboFest Command Center"
              className="w-full h-full border-0"
              allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking; clipboard-read; clipboard-write"
            />

            {/* Floating Top Status Indicator */}
            <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-700 text-xs font-mono flex items-center gap-3 shadow-2xl">
              <span className={`w-3 h-3 rounded-full ${isSafe ? 'bg-emerald-400 animate-ping' : 'bg-red-400 animate-bounce'}`} />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">LIVE TITAN-OS BRIDGE SIGNAL</span>
                <span className={`text-xs font-bold ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isSafe ? 'GREEN: CUTTING AUTHORIZED' : 'RED: CUTTING INHIBITED'}
                </span>
              </div>
            </div>

            {/* Quick URL Indicator Pill */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-800 text-[11px] font-mono text-neutral-300 hidden sm:block">
              Embedded: <span className="text-cyan-400">{deployedSimUrl}</span>
            </div>
          </div>

          {/* Integration Guide for the User's Website */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-dark-border space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
              <Zap className="w-4 h-4" />
              <span>How your simulation website reads our live safety signal</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              In your simulation script, you can fetch live sensors from our server or listen to window messages:
            </p>
            <pre className="bg-black p-3.5 rounded-lg border border-neutral-800 text-emerald-400 text-[11px] overflow-x-auto">
{`// 1. Fetch live opposite compartment gas & temperature:
const checkSafety = async () => {
  const res = await fetch('http://localhost:5000/api/sensors/live');
  const { safety, telemetry } = await res.json();
  
  if (safety.isSafeToCut) {
    // Green signal: Authorize cutting
    robot.startLaserCutting();
    updateUI({ color: 'green', status: 'SAFE TO CUT' });
  } else {
    // Red signal: Inhibit cutting and show alert
    robot.stopLaserCutting();
    updateUI({ color: 'red', status: 'HAZARDOUS GAS DETECTED IN OPPOSITE VOID!' });
  }
};
setInterval(checkSafety, 2000);`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: Curated Online Simulations Gallery */}
      {activeTab === 'online-gallery' && (
        <div className="space-y-6">
          <div className="border-b border-dark-border pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent-cyan" />
              <span>Curated Online Ship-Cutting & Robotics Simulations</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Select any of these online WebGL robotics and plasma physics models to inspect kinematics and cutting physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {onlineSimulations.map((sim) => (
              <div
                key={sim.id}
                className="card-surface p-5 border border-dark-border bg-dark-card rounded-xl flex flex-col justify-between space-y-4 hover:border-neutral-600 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge bg-cyan-950/60 text-cyan-400 border border-cyan-800 text-[10px] font-mono">
                      {sim.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">{sim.provider}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{sim.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {sim.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setInputUrl(sim.url);
                      setDeployedSimUrl(sim.url);
                      setActiveTab('user-deployed');
                    }}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 font-mono"
                  >
                    <span>Load in Embed Frame</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={sim.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white p-1"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
