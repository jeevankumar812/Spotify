import mongoose from "mongoose";

export const getAnalytics = async (req, res) => {
  try {
    const userDB = mongoose.connection.useDb("userDB");
    const musicDB = mongoose.connection.useDb("musicDB");

    const users = await userDB.collection("users").countDocuments();
    const songs = await musicDB.collection("songs").countDocuments();

    const topSongs = await musicDB.collection("songs")
      .find()
      .sort({ playCount: -1 })
      .limit(3)
      .toArray();

    res.json({
      totalUsers: users,
      totalSongs: songs,
      topSongs
    });

  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({ message: "Analytics failed" });
  }
};