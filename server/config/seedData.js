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
  { _id: '670200000000000000000001', partId: 'PLT-HULL-101', name: 'Forward Hull Plating A', type: 'Hull Plate', weight: 4200, thickness: 28, status: 'cut', notes: 'High tensile AH36' },
  { _id: '670200000000000000000002', partId: 'BM-DECK-204', name: 'Main Deck Longitudinal Beam 04', type: 'Deck Beam', weight: 1850, thickness: 22, status: 'cut', notes: 'Clean bevel edge' },
  { _id: '670200000000000000000003', partId: 'BLK-HD-311', name: 'Transverse Bulkhead 11', type: 'Bulkhead', weight: 3100, thickness: 24, status: 'in_progress', notes: 'Active robotic cut' },
  { _id: '670200000000000000000004', partId: 'PIP-BALL-05', name: 'Ballast Manifold Piping', type: 'Pipe', weight: 640, thickness: 12, status: 'cut', notes: 'Copper-nickel alloy' },
  { _id: '670200000000000000000005', partId: 'KEL-SEG-01', name: 'Keel Centerline Segment 01', type: 'Keel Segment', weight: 5800, thickness: 35, status: 'pending', notes: 'Heavy section' },
  { _id: '670200000000000000000006', partId: 'WST-IRR-08', name: 'Irregular Corrosion Slag', type: 'Other', weight: 290, thickness: 8, status: 'waste', notes: 'Oxidized plate remnants' },
];

export const defaultMaterials = {
  _id: '670300000000000000000001',
  sampleBatchId: 'BATCH-2026-MAT-77',
  composition: {
    steel: 78.5,
    iron: 12.2,
    aluminum: 4.8,
    copper: 2.7,
    other: 1.8,
  },
  totalWeight: 19350, // tons
  grade: 'Marine Grade AH36 / Mild Steel Mix',
  corrosionLevel: 'Moderate',
  recyclabilityScore: 94.6,
  conditionNotes: 'Optimal for electric arc furnace smelting. Minimal composite contaminants.',
};

export const defaultMaintenance = {
  robotId: 'CUT-ROBOT-TITAN-X1',
  robotStatus: 'Operational',
  components: [
    { name: 'Hypertherm Plasma Cutting Torch', healthScore: 92, status: 'Optimal', lastChecked: new Date() },
    { name: 'Hydraulic Multi-Axis Arm Actuator', healthScore: 88, status: 'Good', lastChecked: new Date() },
    { name: 'LiDAR & Optical Visual Guidance', healthScore: 97, status: 'Optimal', lastChecked: new Date() },
    { name: 'Caterpillar Track Magnetic Grip', healthScore: 79, status: 'Warning', lastChecked: new Date() },
    { name: 'Fume Extraction & Cooling Shield', healthScore: 94, status: 'Optimal', lastChecked: new Date() },
  ],
  logs: [
    { id: 'M-101', date: '2026-09-28', type: 'Routine', description: 'Plasma nozzle replacement & optical sensor lens cleaning', technician: 'Marcus Vance', cost: 1250, status: 'completed' },
    { id: 'M-102', date: '2026-09-15', type: 'Calibration', description: '6-axis kinematic drift calibration & laser zeroing', technician: 'Elena Rostova', cost: 850, status: 'completed' },
    { id: 'M-103', date: '2026-10-10', type: 'Preventative', description: 'Magnetic grip coil insulation inspection & hydraulic fluid flush', technician: 'Marcus Vance', cost: 2400, status: 'scheduled' },
  ]
};

export const defaultFeasibility = {
  estimatedCost: 340000,
  actualCost: 285000,
  materialMarketValue: 890000,
  laborCost: 110000,
  disposalCost: 18000,
  netProfit: 477000,
  estimatedDays: 45,
  actualDays: 32,
  efficiencyScore: 91.2,
  materialYieldPercent: 93.8,
  wastePercent: 6.2,
  roi: 167.3,
  notes: 'Autonomous robotic cutting accelerated dismantling by 13 days vs traditional manual flame cutting, yielding +24% margin improvement.'
};
