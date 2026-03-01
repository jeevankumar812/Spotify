import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: String,
    audioUrl: String,

    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },

    costPerClick: { type: Number, default: 5 },   // ₹5 per click
    revenue: { type: Number, default: 0 }         // total earned
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);