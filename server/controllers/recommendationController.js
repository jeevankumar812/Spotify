import Song from "../models/Song.js";

export const getRecommendations = async (req, res) => {
  const topSongs = await Song.find().sort({ playCount: -1 }).limit(5);
  res.json(topSongs);
};