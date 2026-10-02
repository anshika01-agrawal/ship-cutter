import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    shipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', required: true },
    operationId: { type: mongoose.Schema.Types.ObjectId, ref: 'CuttingOperation' },
    sampleBatchId: { type: String, required: true },
    composition: {
      iron: { type: Number, default: 0 }, // %
      steel: { type: Number, default: 0 },
      aluminum: { type: Number, default: 0 },
      copper: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    totalWeight: { type: Number, default: 0 }, // tons
    grade: { type: String, default: 'Grade A Ship Steel' },
    corrosionLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'Heavy', 'Severe'],
      default: 'Moderate',
    },
    recyclabilityScore: { type: Number, min: 0, max: 100, default: 90 }, // %
    conditionNotes: { type: String, default: '' },
    photo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Material', materialSchema);
