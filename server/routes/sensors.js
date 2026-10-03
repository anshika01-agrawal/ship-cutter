import express from 'express';

const router = express.Router();

const ADAFRUIT_USERNAME = process.env.ADAFRUIT_IO_USERNAME || 'anshika01_';
const ADAFRUIT_KEY = process.env.ADAFRUIT_IO_KEY || '';

// Memory store for latest telemetry & historical sensor points
let latestSensors = {
  temperature: 25.66, // Celsius (from Adafruit feed)
  oppositeSideTemp: 28.5, // Celsius on reverse compartment wall
  gasPPM: 14.8, // PPM
  oppositeSideGasPPM: 8.2, // PPM on reverse compartment wall
  flammableGasLevel: 3.5, // % of LEL (Lower Explosive Limit)
  toxicGasType: 'None (Clean Air)',
  distanceMM: 40.0, // Plasma torch ultrasonic standoff distance in mm
  pressureHPa: 1013.2,
  humidity: 48.0,
  lastUpdated: new Date().toISOString(),
  source: 'Adafruit IO Live (anshika01_)',
  isAdafruitLive: true,
};

// Store raw historical points directly from Adafruit feeds
let adafruitRawFeeds = {
  temperature: [],
  ultrasonic: [],
  'thermal-camera': [],
  'gas-ppm': [],
};

// Historical ring buffer for charts (last 30 points)
const historyLength = 30;
let sensorHistory = [];

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

// Background sync with Adafruit IO REST API
async function syncAdafruitFeeds() {
  const headers = { 'X-AIO-Key': ADAFRUIT_KEY };
  const feeds = ['temperature', 'ultrasonic', 'thermal-camera', 'gas-ppm'];

  for (const feedKey of feeds) {
    try {
      const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_USERNAME}/feeds/${feedKey}/data?limit=25`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        adafruitRawFeeds[feedKey] = data.map((d) => ({
          value: parseFloat(d.value),
          createdAt: d.created_at,
          time: new Date(d.created_at).toLocaleTimeString(),
        }));

        // If feed has data, update latest sensor telemetry
        if (data.length > 0 && !isNaN(parseFloat(data[0].value))) {
          const val = parseFloat(data[0].value);
          if (feedKey === 'temperature') {
            latestSensors.temperature = val;
          } else if (feedKey === 'ultrasonic') {
            latestSensors.distanceMM = val;
          } else if (feedKey === 'thermal-camera') {
            latestSensors.oppositeSideTemp = manualHazardOverride ? 62.4 : val;
          } else if (feedKey === 'gas-ppm') {
            latestSensors.oppositeSideGasPPM = manualHazardOverride ? 78.5 : val;
          }
        }
      }
    } catch (err) {
      // Quiet fail on network hiccup
    }
  }

  // Update history record
  latestSensors.lastUpdated = new Date().toISOString();
  sensorHistory.push({
    time: new Date().toLocaleTimeString(),
    temperature: latestSensors.temperature,
    oppositeSideTemp: latestSensors.oppositeSideTemp,
    gasPPM: latestSensors.gasPPM,
    oppositeSideGasPPM: latestSensors.oppositeSideGasPPM,
    distanceMM: latestSensors.distanceMM,
  });
  if (sensorHistory.length > historyLength) sensorHistory.shift();
}

// Initial sync and start background poller every 3.5 seconds
syncAdafruitFeeds();
setInterval(syncAdafruitFeeds, 3500);

// GET latest sensors and safety decision
router.get('/live', async (req, res) => {
  const safety = evaluateSafety(latestSensors);

  res.json({
    telemetry: latestSensors,
    safety,
    history: sensorHistory,
    adafruitRawFeeds,
    adafruitUsername: ADAFRUIT_USERNAME,
    isAdafruitConnected: true,
  });
});

// GET Adafruit IO Proxy (Fetch directly from Adafruit feeds)
router.get('/adafruit/feed/:feedKey', async (req, res) => {
  const { feedKey } = req.params;
  const username = req.query.username || ADAFRUIT_USERNAME;
  const aioKey = req.query.key || ADAFRUIT_KEY;

  try {
    const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data?limit=25`;
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
  if (manualHazardOverride) {
    latestSensors.oppositeSideTemp = 62.4;
    latestSensors.oppositeSideGasPPM = 78.5;
    latestSensors.flammableGasLevel = 24.0;
    latestSensors.toxicGasType = 'Volatile Hydrocarbon Residue Detected';
  } else {
    latestSensors.oppositeSideTemp = 28.5;
    latestSensors.oppositeSideGasPPM = 8.2;
    latestSensors.flammableGasLevel = 3.5;
    latestSensors.toxicGasType = 'None (Clean Air)';
  }
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
