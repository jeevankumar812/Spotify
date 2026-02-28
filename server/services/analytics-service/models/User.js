import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    subscriptionType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);