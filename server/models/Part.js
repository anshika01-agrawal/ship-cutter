import mongoose from 'mongoose';

const partSchema = new mongoose.Schema(
  {
    shipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', required: true },
    operationId: { type: mongoose.Schema.Types.ObjectId, ref: 'CuttingOperation' },
    partId: { type: String, required: true }, // e.g. HULL-P-104
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['Hull Plate', 'Deck Beam', 'Bulkhead', 'Pipe', 'Keel Segment', 'Propeller/Shaft', 'Engine Bracket', 'Other'],
      default: 'Hull Plate',
    },
    weight: { type: Number, required: true }, // in kg
    thickness: { type: Number, default: 0 }, // in mm
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'cut', 'waste', 'salvaged'],
      default: 'pending',
    },
    photo: { type: String, default: '' },
    cutTimestamp: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Part', partSchema);
