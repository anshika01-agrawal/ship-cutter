import mongoose from 'mongoose';

const feasibilitySchema = new mongoose.Schema(
  {
    shipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', required: true },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    materialMarketValue: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    disposalCost: { type: Number, default: 0 },
    netProfit: { type: Number, default: 0 },
    estimatedDays: { type: Number, default: 0 },
    actualDays: { type: Number, default: 0 },
    efficiencyScore: { type: Number, default: 85 }, // %
    materialYieldPercent: { type: Number, default: 92 }, // %
    wastePercent: { type: Number, default: 8 }, // %
    roi: { type: Number, default: 0 }, // %
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Feasibility', feasibilitySchema);
