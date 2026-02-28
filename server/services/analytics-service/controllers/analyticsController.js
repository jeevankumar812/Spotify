import User from "../models/User.js";
import Song from "../models/Song.js";

export const getAnalytics = async (req, res) => {
  const users = await User.countDocuments();
  const songs = await Song.countDocuments();
  const topSongs = await Song.find().sort({ playCount: -1 }).limit(3);

  res.json({
    totalUsers: users,
    totalSongs: songs,
    topSongs
  });
};