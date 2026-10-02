import mongoose from 'mongoose';

const cuttingOperationSchema = new mongoose.Schema(
  {
    shipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', required: true },
    operationId: { type: String, required: true, unique: true },
    robotId: { type: String, default: 'ROBOT-ALPHA-01' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    totalParts: { type: Number, default: 0 },
    cutParts: { type: Number, default: 0 },
    remainingParts: { type: Number, default: 0 },
    wasteParts: { type: Number, default: 0 },
    currentSpeed: { type: Number, default: 0 }, // in cm/min or m/hr
    cuttingZone: { type: String, default: 'Bow Section' },
    status: {
      type: String,
      enum: ['ready', 'running', 'paused', 'completed', 'aborted'],
      default: 'ready',
    },
    activityLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        message: { type: String, required: true },
        type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('CuttingOperation', cuttingOperationSchema);
