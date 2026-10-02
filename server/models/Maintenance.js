import mongoose from 'mongoose';

const componentHealthSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. Plasma Torch, Hydraulic Pump, Track Motors, Optical Sensors
  healthScore: { type: Number, min: 0, max: 100, default: 100 },
  status: { type: String, enum: ['Optimal', 'Good', 'Warning', 'Critical'], default: 'Optimal' },
  lastChecked: { type: Date, default: Date.now },
});

const maintenanceSchema = new mongoose.Schema(
  {
    robotId: { type: String, default: 'ROBOT-ALPHA-01' },
    robotStatus: {
      type: String,
      enum: ['Operational', 'Needs Service', 'Under Maintenance', 'Critical'],
      default: 'Operational',
    },
    components: [componentHealthSchema],
    type: {
      type: String,
      enum: ['Routine', 'Preventative', 'Emergency', 'Calibration', 'Upgrade'],
      default: 'Routine',
    },
    description: { type: String, required: true },
    scheduledDate: { type: Date, default: Date.now },
    completedDate: { type: Date },
    technician: { type: String, default: 'Chief Engineer' },
    cost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'deferred'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Maintenance', maintenanceSchema);
