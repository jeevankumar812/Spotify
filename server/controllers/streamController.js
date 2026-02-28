import Song from "../models/Song.js";
import User from "../models/User.js";
import Ad from "../models/Ad.js";

export const streamSong = async (req, res) => {
  const { songId } = req.params;

  const song = await Song.findById(songId);
  if (!song) return res.status(404).json({ message: "Song not found" });

  song.playCount++;
  await song.save();

  const user = await User.findById(req.user.id);

  if (user.subscriptionType === "free") {
    const ad = await Ad.findOne();
    if (ad) ad.impressions++;
    return res.json({ ad, song });
  }

  res.json({ song });
};