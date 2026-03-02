import mongoose from "mongoose";

export const getAnalytics = async (req, res) => {
  try {
    const analyticsDB = mongoose.connection.useDb("analyticsDB");

    const stats = await analyticsDB.collection("stats").findOne({ _id: "global" }) || {
      totalUsers: 0,
      totalStreams: 0
    };

    const topSongs = await analyticsDB.collection("songStats")
      .find()
      .sort({ playCount: -1 })
      .limit(3)
      .toArray();

    res.json({
      totalUsers: stats.totalUsers || 0,
      totalStreams: stats.totalStreams || 0,
      topSongs
    });

  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({ message: "Analytics failed" });
  }
};