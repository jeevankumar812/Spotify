import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  costPerClick: { type: Number, default: 5 },
  revenue: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Ad", adSchema);