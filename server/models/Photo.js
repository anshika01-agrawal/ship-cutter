import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    category: {
      type: String,
      enum: ['cutting', 'material', 'parts', 'before_after', 'ship', 'inspection', 'robot'],
      default: 'cutting',
    },
    shipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship' },
    partId: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
    tags: [{ type: String }],
    description: { type: String, default: '' },
    metadata: {
      width: Number,
      height: Number,
      size: Number,
      mimeType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Photo', photoSchema);
