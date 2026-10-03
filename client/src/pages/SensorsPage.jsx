import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Activity,
  Flame,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Wifi,
  Settings,
  RefreshCw,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Code
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SensorsPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [safety, setSafety] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [livePolling, setLivePolling] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  // Adafruit IO configuration state
  const [adafruitConfig, setAdafruitConfig] = useState({
    username: localStorage.getItem('AIO_USER') || '',
    aioKey: localStorage.getItem('AIO_KEY') || '',
    tempFeed: 'temperature',
    gasFeed: 'gas-sensor',
    distFeed: 'ultrasonic-distance',
  });
  const [configSaved, setConfigSaved] = useState(false);

  // Fetch telemetry
  const fetchTelemetry = async () => {
    try {
      const res = await api.getLiveSensors();
      setTelemetry(res.telemetry);
      setSafety(res.safety);
      setHistory(res.history || []);
    } catch (err) {
      console.error('Failed to fetch live sensor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Live polling loop every 2500ms
  useEffect(() => {
    if (!livePolling) return;
    const interval = setInterval(fetchTelemetry, 2500);
    return () => clearInterval(interval);
  }, [livePolling]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('AIO_USER', adafruitConfig.username);
    localStorage.setItem('AIO_KEY', adafruitConfig.aioKey);
    setConfigSaved(true);
    setTimeout(() => {
      setConfigSaved(false);
      setShowConfigModal(false);
    }, 1200);
  };

  const handleToggleHazard = async () => {
    try {
      const res = await api.toggleHazardSimulation();
      setSafety(res.safety);
      fetchTelemetry();
    } catch (err) {
      alert('Error toggling hazard: ' + err.message);
    }
  };

  if (loading && !telemetry) return <LoadingSpinner text="Connecting to ESP32 Adafruit IO Sensor Stream..." />;

  const labels = history.map((h) => h.time);

  // Temperature Chart Data
  const tempData = {
    labels,
    datasets: [
      {
        label: 'Torch Cut Zone Temp (°C)',
        data: history.map((h) => h.temperature),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Opposite Compartment Wall Temp (°C)',
        data: history.map((h) => h.oppositeSideTemp),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.05)',
        tension: 0.3,
        borderDash: [5, 5],
      },
    ],
  };

  // Gas PPM Chart Data
  const gasData = {
    labels,
    datasets: [
      {
        label: 'Reverse Void Gas Concentration (PPM)',
        data: history.map((h) => h.oppositeSideGasPPM),
        borderColor: safety?.isSafeToCut ? '#10b981' : '#f43f5e',
        backgroundColor: safety?.isSafeToCut ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Cutting Face Ambient Gas (PPM)',
        data: history.map((h) => h.gasPPM),
        borderColor: '#94a3b8',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#888', font: { family: 'monospace', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#888', font: { family: 'monospace', size: 10 } },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#ccc', font: { family: 'sans-serif', size: 11 } },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-accent-cyan animate-pulse" />
            <h2 className="text-xl font-bold text-white">Adafruit IO & ESP32 Live Sensor Telemetry</h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Real-time multi-sensor telemetry stream monitoring volatile gases, ambient temperatures, and reverse compartment hazards.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setLivePolling(!livePolling)}
            className={`btn-secondary text-xs flex items-center gap-1.5 ${
              livePolling ? 'border-emerald-700 text-emerald-400 bg-emerald-950/30' : 'text-neutral-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${livePolling ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
            <span>{livePolling ? 'Live Streaming' : 'Polling Paused'}</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Adafruit IO Settings</span>
          </button>

          <button
            onClick={() => setShowCodeSnippet(!showCodeSnippet)}
            className="btn-outline text-xs flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" />
            <span>ESP32 Arduino Code</span>
          </button>
        </div>
      </div>

      {/* Real-time Safety Interlock Banner */}
      <div
        className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          safety?.isSafeToCut
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            : 'bg-red-950/50 border-red-500/70 text-red-200'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
              safety?.isSafeToCut
                ? 'bg-emerald-900/60 border-emerald-400 text-emerald-300 shadow-glow'
                : 'bg-red-900/60 border-red-500 text-red-200 animate-pulse'
            }`}
          >
            {safety?.isSafeToCut ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                {safety?.signal}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-neutral-700">
                SAFETY SCORE: {safety?.safetyScore}%
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {safety?.statusText}
            </h3>
            <p className="text-xs opacity-90 mt-1 max-w-xl">
              {safety?.reasons?.[0]}
            </p>
          </div>
        </div>

        {/* Hazard injection test trigger */}
        <button
          onClick={handleToggleHazard}
          className={`btn-primary text-xs font-mono py-2 px-4 shrink-0 ${
            safety?.isSafeToCut
              ? 'bg-amber-400 text-black hover:bg-amber-300'
              : 'bg-emerald-400 text-black hover:bg-emerald-300'
          }`}
        >
          {safety?.isSafeToCut ? 'Simulate Gas Leak on Opposite Side' : 'Purge Hazard & Re-Authorize'}
        </button>
      </div>

      {/* 4 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Opposite Compartment Temp"
          value={`${telemetry?.oppositeSideTemp || 28}°C`}
          unit={`Max Safe: ${safety?.thresholds?.maxOppositeTemp || 50}°C`}
          icon={Thermometer}
          change={telemetry?.oppositeSideTemp > 50 ? 'CRITICAL HEAT' : 'Safe Wall Temp'}
          changeType={telemetry?.oppositeSideTemp > 50 ? 'negative' : 'positive'}
        />

        <StatsCard
          title="Reverse Void Gas Concentration"
          value={`${telemetry?.oppositeSideGasPPM || 8} PPM`}
          unit={`Threshold: ${safety?.thresholds?.maxGasPPM || 35} PPM`}
          icon={Flame}
          change={telemetry?.oppositeSideGasPPM > 35 ? 'VOLATILE GAS' : 'Clear Atmosphere'}
          changeType={telemetry?.oppositeSideGasPPM > 35 ? 'negative' : 'positive'}
          subtitle={`Toxic Type: ${telemetry?.toxicGasType || 'None'}`}
        />

        <StatsCard
          title="Lower Explosive Limit (LEL)"
          value={`${telemetry?.flammableGasLevel || 3.2}%`}
          unit="LEL Limit: 10%"
          icon={ShieldAlert}
          change={telemetry?.flammableGasLevel > 10 ? 'EXPLOSION RISK' : 'Inert Zone'}
          changeType={telemetry?.flammableGasLevel > 10 ? 'negative' : 'positive'}
        />

        <StatsCard
          title="Plasma Torch Standoff Distance"
          value={`${telemetry?.distanceMM || 3.2} mm`}
          unit="Target: 3.2 ± 0.3 mm"
          icon={Gauge}
          change="Optimal Arc Standoff"
          changeType="positive"
        />
      </div>

      {/* Live Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Temperature */}
        <div className="card-surface p-5 border border-dark-border bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase">
                Real-Time Thermal Gradients (°C)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              TORCH VS OPPOSITE BULKHEAD
            </span>
          </div>

          <div className="h-64 w-full">
            <Line data={tempData} options={chartOptions} />
          </div>

          <div className="mt-4 pt-3 border-t border-dark-border flex justify-between text-xs text-neutral-400 font-mono">
            <span>Torch Zone: <strong className="text-orange-400">{telemetry?.temperature}°C</strong></span>
            <span>Opposite Wall: <strong className="text-cyan-400">{telemetry?.oppositeSideTemp}°C</strong></span>
          </div>
        </div>

        {/* Chart 2: Toxic & Flammable Gas PPM */}
        <div className="card-surface p-5 border border-dark-border bg-dark-card flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase">
                Harmful Gas Concentration (PPM)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              MQ-2 / MQ-135 SENSOR STREAM
            </span>
          </div>

          <div className="h-64 w-full">
            <Line data={gasData} options={chartOptions} />
          </div>

          <div className="mt-4 pt-3 border-t border-dark-border flex justify-between text-xs text-neutral-400 font-mono">
            <span>Cut Face: <strong className="text-neutral-300">{telemetry?.gasPPM} PPM</strong></span>
            <span>Reverse Void: <strong className={safety?.isSafeToCut ? 'text-emerald-400' : 'text-red-400 font-bold'}>{telemetry?.oppositeSideGasPPM} PPM</strong></span>
          </div>
        </div>
      </div>

      {/* ESP32 Arduino Code Modal / Snippet */}
      {showCodeSnippet && (
        <div className="card-surface p-6 border border-dark-border bg-neutral-950 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
            <span className="text-cyan-400 font-bold">ESP32 DIRECT HTTP POST CODE SNIPPET (C++ / Arduino IDE)</span>
            <button onClick={() => setShowCodeSnippet(false)} className="text-neutral-400 hover:text-white">Close</button>
          </div>
          <p className="text-neutral-400 mb-3 text-[11px]">
            Your ESP32 can send readings directly to this platform without extra cloud services, or publish to Adafruit IO:
          </p>
          <pre className="bg-black p-4 rounded-lg overflow-x-auto text-[11px] text-emerald-400 leading-relaxed border border-neutral-800">
{`#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_SERVER_IP:5000/api/sensors/esp32-stream";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Replace with your actual sensor analogRead / DHT read values:
    float temp = 33.5;
    float oppTemp = 28.2;
    float gasPPM = analogRead(34) * (100.0 / 4095.0);
    float oppGas = analogRead(35) * (100.0 / 4095.0);

    String payload = "{\\"temperature\\":" + String(temp) + 
                     ",\\"oppositeSideTemp\\":" + String(oppTemp) + 
                     ",\\"gasPPM\\":" + String(gasPPM) + 
                     ",\\"oppositeSideGasPPM\\":" + String(oppGas) + "}";

    int httpResponseCode = http.POST(payload);
    Serial.println("Response code: " + String(httpResponseCode));
    http.end();
  }
  delay(2500); // Send every 2.5 seconds
}`}
          </pre>
        </div>
      )}

      {/* Adafruit IO Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full border border-neutral-700 bg-neutral-950">
            <h3 className="text-base font-bold text-white mb-1">Adafruit IO Feed Credentials</h3>
            <p className="text-xs text-text-secondary mb-4">
              Enter your Adafruit IO credentials to pull live MQTT / REST data from your ESP32 feeds.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">ADAFRUIT IO USERNAME</label>
                <input
                  type="text"
                  placeholder="e.g. your_adafruit_username"
                  value={adafruitConfig.username}
                  onChange={(e) => setAdafruitConfig({ ...adafruitConfig, username: e.target.value })}
                  className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">ADAFRUIT AIO KEY</label>
                <input
                  type="password"
                  placeholder="aio_xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={adafruitConfig.aioKey}
                  onChange={(e) => setAdafruitConfig({ ...adafruitConfig, aioKey: e.target.value })}
                  className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-mono text-neutral-400 mb-1">TEMP FEED KEY</label>
                  <input
                    type="text"
                    value={adafruitConfig.tempFeed}
                    onChange={(e) => setAdafruitConfig({ ...adafruitConfig, tempFeed: e.target.value })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-neutral-400 mb-1">GAS FEED KEY</label>
                  <input
                    type="text"
                    value={adafruitConfig.gasFeed}
                    onChange={(e) => setAdafruitConfig({ ...adafruitConfig, gasFeed: e.target.value })}
                    className="w-full bg-neutral-900 border border-dark-border rounded px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              {configSaved && (
                <div className="p-2.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Adafruit IO credentials configured!</span>
                </div>
              )}

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="btn-secondary w-1/2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary w-1/2">
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
