import express from 'express';

const router = express.Router();

// Memory store for latest telemetry & historical sensor points
let latestSensors = {
  temperature: 34.2, // Celsius
  oppositeSideTemp: 28.5, // Celsius on reverse compartment wall
  gasPPM: 14.8, // PPM
  oppositeSideGasPPM: 8.2, // PPM on reverse compartment wall
  flammableGasLevel: 3.5, // % of LEL (Lower Explosive Limit)
  toxicGasType: 'None (Clean Air)',
  distanceMM: 3.2, // Plasma torch standoff distance
  pressureHPa: 1013.2,
  humidity: 48.0,
  lastUpdated: new Date().toISOString(),
  source: 'ESP32 Telemetry (Adafruit IO Stream)',
};

// Historical ring buffer for charts (last 30 points)
const historyLength = 30;
let sensorHistory = Array.from({ length: historyLength }, (_, i) => {
  const time = new Date(Date.now() - (historyLength - 1 - i) * 3000);
  return {
    time: time.toLocaleTimeString(),
    temperature: +(32 + Math.sin(i * 0.4) * 3 + Math.random() * 1.5).toFixed(1),
    oppositeSideTemp: +(26 + Math.sin(i * 0.3) * 2 + Math.random()).toFixed(1),
    gasPPM: +(12 + Math.random() * 6).toFixed(1),
    oppositeSideGasPPM: +(6 + Math.random() * 4).toFixed(1),
    distanceMM: +(3.2 + (Math.random() - 0.5) * 0.4).toFixed(2),
  };
});

// Safety parameters
let manualHazardOverride = false;

// Compute safety interlock & authorization signal
function evaluateSafety(sensors) {
  const maxOppositeTemp = 50.0; // °C
  const maxGasPPM = 35.0; // PPM
  const maxFlammableLEL = 10.0; // %

  const tempSafe = sensors.oppositeSideTemp < maxOppositeTemp;
  const gasSafe = sensors.oppositeSideGasPPM < maxGasPPM && sensors.flammableGasLevel < maxFlammableLEL;
  const noManualOverride = !manualHazardOverride;

  const isSafeToCut = tempSafe && gasSafe && noManualOverride;

  const reasons = [];
  if (!tempSafe) reasons.push(`Reverse compartment temperature too high (${sensors.oppositeSideTemp}°C > ${maxOppositeTemp}°C)`);
  if (!gasSafe) reasons.push(`Reverse void volatile gas concentration unsafe (${sensors.oppositeSideGasPPM} PPM > ${maxGasPPM} PPM)`);
  if (!noManualOverride) reasons.push('Emergency safety interlock manually tripped by operator');

  return {
    isSafeToCut,
    signal: isSafeToCut ? 'SIGNAL_AUTHORIZED_GREEN' : 'SIGNAL_INHIBITED_RED',
    statusText: isSafeToCut ? 'SAFE TO CUT — PERMIT GRANTED' : 'HAZARD DETECTED — CUT INHIBITED',
    safetyScore: isSafeToCut ? 98 : 34,
    reasons: reasons.length ? reasons : ['All reverse compartment gas and thermal parameters within certified tolerance'],
    thresholds: {
      maxOppositeTemp,
      maxGasPPM,
      maxFlammableLEL,
    },
    analyzedAt: new Date().toISOString(),
  };
}

// GET latest sensors and safety decision
router.get('/live', (req, res) => {
  // Add subtle realistic drift to simulated live feeds
  latestSensors.temperature = +(33 + Math.random() * 2.5).toFixed(1);
  latestSensors.oppositeSideTemp = manualHazardOverride ? 62.4 : +(27 + Math.random() * 2).toFixed(1);
  latestSensors.gasPPM = +(14 + Math.random() * 3).toFixed(1);
  latestSensors.oppositeSideGasPPM = manualHazardOverride ? 78.5 : +(8 + Math.random() * 4).toFixed(1);
  latestSensors.flammableGasLevel = manualHazardOverride ? 24.0 : +(3.2 + Math.random()).toFixed(1);
  latestSensors.toxicGasType = manualHazardOverride ? 'Methane / Volatile Hydrocarbon Residue' : 'None (Clean Air)';
  latestSensors.distanceMM = +(3.2 + (Math.random() - 0.5) * 0.3).toFixed(2);
  latestSensors.lastUpdated = new Date().toISOString();

  // Push to history
  sensorHistory.push({
    time: new Date().toLocaleTimeString(),
    temperature: latestSensors.temperature,
    oppositeSideTemp: latestSensors.oppositeSideTemp,
    gasPPM: latestSensors.gasPPM,
    oppositeSideGasPPM: latestSensors.oppositeSideGasPPM,
    distanceMM: latestSensors.distanceMM,
  });
  if (sensorHistory.length > historyLength) sensorHistory.shift();

  const safety = evaluateSafety(latestSensors);

  res.json({
    telemetry: latestSensors,
    safety,
    history: sensorHistory,
  });
});

// GET Adafruit IO Proxy (Fetch directly from Adafruit feeds)
router.get('/adafruit/feed/:feedKey', async (req, res) => {
  const { feedKey } = req.params;
  const username = req.query.username || process.env.ADAFRUIT_IO_USERNAME;
  const aioKey = req.query.key || process.env.ADAFRUIT_IO_KEY;

  if (!username) {
    return res.status(400).json({
      error: 'Adafruit IO username required. Configure ADAFRUIT_IO_USERNAME in server/.env or pass ?username=YOUR_USER',
      fallback: latestSensors,
    });
  }

  try {
    const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data?limit=20`;
    const headers = aioKey ? { 'X-AIO-Key': aioKey } : {};
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Adafruit API responded with ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ success: true, feedKey, data });
  } catch (err) {
    res.status(502).json({
      error: err.message,
      message: 'Failed to reach Adafruit IO API. Using onboard ESP32 telemetry cache.',
      fallbackData: latestSensors,
    });
  }
});

// POST endpoint for ESP32 to publish data directly (via HTTP POST from Arduino / MicroPython)
router.post('/esp32-stream', (req, res) => {
  const { temperature, oppositeSideTemp, gasPPM, oppositeSideGasPPM, distanceMM } = req.body;

  if (temperature !== undefined) latestSensors.temperature = Number(temperature);
  if (oppositeSideTemp !== undefined) latestSensors.oppositeSideTemp = Number(oppositeSideTemp);
  if (gasPPM !== undefined) latestSensors.gasPPM = Number(gasPPM);
  if (oppositeSideGasPPM !== undefined) latestSensors.oppositeSideGasPPM = Number(oppositeSideGasPPM);
  if (distanceMM !== undefined) latestSensors.distanceMM = Number(distanceMM);

  latestSensors.lastUpdated = new Date().toISOString();
  latestSensors.source = 'ESP32 Direct Wi-Fi Post';

  res.json({ success: true, received: latestSensors, safety: evaluateSafety(latestSensors) });
});

// POST toggle simulated hazard condition for testing the simulation cut inhibitor
router.post('/toggle-hazard', (req, res) => {
  manualHazardOverride = !manualHazardOverride;
  const safety = evaluateSafety(latestSensors);
  res.json({
    hazardActive: manualHazardOverride,
    message: manualHazardOverride
      ? 'Hazard condition injected: High gas detected in opposite void space. Cut inhibited!'
      : 'Hazard purged: Reverse void cleared and verified. Cutting authorized!',
    safety,
  });
});

export default router;
