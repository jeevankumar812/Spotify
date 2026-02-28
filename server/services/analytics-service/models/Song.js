import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: String,
    artist: String,
    genre: String,
    audioUrl: String,
    playCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

songSchema.index({ title: "text", artist: "text" });

export default mongoose.model("Song", songSchema);