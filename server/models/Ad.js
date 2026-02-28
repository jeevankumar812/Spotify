import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: String,
    audioUrl: String,
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);