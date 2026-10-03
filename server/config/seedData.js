export const defaultShips = [
  {
    _id: '670000000000000000000001',
    name: 'MV Ocean Voyager',
    type: 'Bulk Carrier',
    dimensions: { length: 225, width: 32, height: 18 },
    weight: 28400,
    status: 'cutting_in_progress',
    arrivalDate: '2026-08-15T00:00:00.000Z',
    photos: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
    ],
    notes: 'Primary dismantling project. Heavy marine grade steel hull with high recyclable value.'
  },
  {
    _id: '670000000000000000000002',
    name: 'St. Atlantic Pioneer',
    type: 'Crude Oil Tanker',
    dimensions: { length: 274, width: 48, height: 23 },
    weight: 42100,
    status: 'inspecting',
    arrivalDate: '2026-09-02T00:00:00.000Z',
    photos: [
      'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80'
    ],
    notes: 'Degassing and hazardous material abatement certified. Scheduled for cut phase next week.'
  },
  {
    _id: '670000000000000000000003',
    name: 'Nordic Horizon',
    type: 'Container Ship',
    dimensions: { length: 195, width: 28, height: 16 },
    weight: 19200,
    status: 'completed',
    arrivalDate: '2026-06-10T00:00:00.000Z',
    photos: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    notes: 'Successfully dismantled with 94.2% material recovery efficiency.'
  }
];

export const defaultOperation = {
  _id: '670100000000000000000001',
  operationId: 'OP-2026-OCT-884',
  shipId: '670000000000000000000001',
  robotId: 'CUT-ROBOT-TITAN-X1',
  startTime: '2026-10-01T06:00:00.000Z',
  progress: 68.4,
  totalParts: 420,
  cutParts: 287,
  remainingParts: 112,
  wasteParts: 21,
  currentSpeed: 142.5, // cm/min
  cuttingZone: 'Midship Cargo Hold #3',
  status: 'running',
  activityLogs: [
    { timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), message: 'High-power plasma torch ignited at Hold #3 Portside', type: 'info' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), message: 'Transverse bulkhead plate #41 cut clean in 4m 12s', type: 'success' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), message: 'Thermal camera detected localized heat variance; adjusting speed to 142 cm/min', type: 'warning' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(), message: 'Autonomous segment extraction arm engaged on Part P-288', type: 'info' },
  ]
};

export const defaultParts = [
  { _id: '670200000000000000000001', partId: 'PLT-HULL-101', name: 'Forward Hull Plating A', type: 'Hull Plate', weight: 4200, thickness: 28, status: 'cut', notes: 'IS 2062 E250 / IRS AH36 Marine Steel (HMS-1)' },
  { _id: '670200000000000000000002', partId: 'BM-DECK-204', name: 'Main Deck Longitudinal Girder 04', type: 'Deck Beam', weight: 1850, thickness: 22, status: 'cut', notes: 'IS 2062 E350 Flange (Rerolling Tawa Plate)' },
  { _id: '670200000000000000000003', partId: 'BLK-HD-311', name: 'Transverse Watertight Bulkhead 11', type: 'Bulkhead', weight: 3100, thickness: 24, status: 'in_progress', notes: 'IS 2002 Boiler Quality Marine Steel' },
  { _id: '670200000000000000000004', partId: 'PIP-BALL-05', name: 'Ballast Condenser Manifold Piping', type: 'Pipe', weight: 640, thickness: 12, status: 'cut', notes: 'Cupro-Nickel Cu-Ni 90/10 Naval Marine Alloy' },
  { _id: '670200000000000000000005', partId: 'KEL-SEG-01', name: 'Keel Centerline Box Girder Segment 01', type: 'Keel Segment', weight: 5800, thickness: 35, status: 'pending', notes: 'IS 2062 Heavy 35mm Plate (Alang Yard Prime HMS-1)' },
  { _id: '670200000000000000000006', partId: 'BRS-BUSH-07', name: 'Stern Propeller Shaft Bushing', type: 'Shaft Sleeve', weight: 890, thickness: 45, status: 'cut', notes: 'Naval Brass IS 291 / Phosphor Bronze IS 28' },
  { _id: '670200000000000000000007', partId: 'WST-IRR-08', name: 'Oxidized Cut Kerf Slag Remnants', type: 'Other', weight: 290, thickness: 8, status: 'waste', notes: 'HMS-2 Secondary Induction Furnace Scrap' },
];

export const defaultMaterials = {
  _id: '670300000000000000000001',
  sampleBatchId: 'BATCH-2026-ALANG-MAT-77',
  composition: {
    steel: 78.5,
    iron: 12.2,
    aluminum: 4.8,
    copper: 2.7,
    other: 1.8,
  },
  totalWeight: 19350, // Metric Tons
  grade: 'IS 2062 Grade E250 / IRS AH36 Marine High-Tensile Steel',
  corrosionLevel: 'Moderate (SA 2.5 Shot-Blast Ready)',
  recyclabilityScore: 94.6,
  conditionNotes: 'Optimal for Indian Electric Arc Furnaces (EAF) & Mandi Gobindgarh / Bhavnagar Re-Rolling Mills. Sulfur < 0.035%, Phosphorus < 0.035%.',
};

export const defaultMaintenance = {
  robotId: 'CUT-ROBOT-KRAN-VULCAN',
  robotStatus: 'Operational',
  components: [
    { name: 'Hypertherm Plasma Cutting Torch & Ultrasonic Standoff Sensor', healthScore: 94, status: 'Optimal', lastChecked: new Date() },
    { name: 'Hydraulic Multi-Axis Arm Actuator & Mica Heat Shield', healthScore: 89, status: 'Good', lastChecked: new Date() },
    { name: 'OAK-D Lite Vision & Thermal IR Camera Guidance', healthScore: 97, status: 'Optimal', lastChecked: new Date() },
    { name: 'Continuous Rubber Track Neodymium Magnet Clamps', healthScore: 91, status: 'Optimal', lastChecked: new Date() },
    { name: 'Triple Gas Sensor Sniffer & Active Spark Blower', healthScore: 95, status: 'Optimal', lastChecked: new Date() },
  ],
  logs: [
    { id: 'M-101', date: '2026-09-28', type: 'Routine', description: 'Plasma copper nozzle replacement & ultrasonic transducer calibration', technician: 'Rajesh Sharma', cost: 95000, status: 'completed' },
    { id: 'M-102', date: '2026-09-15', type: 'Calibration', description: '6-axis inverse kinematics drift tuning & laser zeroing', technician: 'Vikram Patel', cost: 68000, status: 'completed' },
    { id: 'M-103', date: '2026-10-10', type: 'Preventative', description: 'Neodymium magnetic grip coil flux test & hydraulic fluid flush', technician: 'Rajesh Sharma', cost: 185000, status: 'scheduled' },
  ]
};

export const defaultFeasibility = {
  estimatedCost: 32000000, // ₹3.20 Crore
  actualCost: 26800000,    // ₹2.68 Crore
  materialMarketValue: 74500000, // ₹7.45 Crore (@ ₹38,500/MT HMS-1 Indian market benchmark)
  laborCost: 6500000,      // ₹65.0 Lakh
  disposalCost: 1500000,   // ₹15.0 Lakh
  netProfit: 47700000,     // ₹4.77 Crore
  estimatedDays: 45,
  actualDays: 32,
  efficiencyScore: 92.4,
  materialYieldPercent: 94.2,
  wastePercent: 5.8,
  roi: 178.0,
  scrapRatePerTon: 38500,  // ₹38,500/MT
  notes: 'KRAN-VULCAN robotic crawler accelerated Alang shipyard dismantling by 13 days vs manual gas cutters, yielding ₹82.5 Lakh direct savings (+26.4% EBITDA margin improvement) and 0% human confined-space hazard.'
};
