import mongoose from 'mongoose';

const shipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }, // e.g. Cargo, Tanker, Container, Bulk Carrier
    dimensions: {
      length: { type: Number, default: 0 }, // in meters
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    weight: { type: Number, required: true }, // in metric tons (LDT)
    arrivalDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['docked', 'inspecting', 'cutting_in_progress', 'completed', 'scrapped'],
      default: 'docked',
    },
    photos: [{ type: String }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Ship', shipSchema);
