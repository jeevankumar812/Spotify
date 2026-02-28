import Song from "../models/Song.js";
import User from "../models/User.js";
import Ad from "../models/Ad.js";

export const streamSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId);
    if (!song)
      return res.status(404).json({ message: "Song not found" });

    song.playCount++;
    await song.save();

    const user = await User.findById(req.user?.id);
    if (!user)
      return res.status(404).json({ message: "User not found in streaming DB" });

    if (user.subscriptionType === "free") {
      const ad = await Ad.findOne();
      if (ad) {
        ad.impressions++;
        await ad.save();
      }
      return res.json({ ad, song });
    }

    res.json({ song });

  } catch (error) {
    console.error("FULL STREAM ERROR:", error);
    res.status(500).json({ message: "Streaming failed" });
  }
};