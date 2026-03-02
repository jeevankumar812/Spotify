import Song from "../models/Song.js";
import Ad from "../models/Ad.js";
import { publishEvent } from "../utils/rabbitmq.js";

export const streamSong = async (req, res) => {
  try {
    const { songId } = req.params;

    // 1️⃣ Find song
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // 2️⃣ Increase play count
    song.playCount++;
    await song.save();

    await publishEvent({
    type: "SONG_PLAYED",
    songId: song._id,
    userId: req.user.id,
    timestamp: new Date()
    });

    // 3️⃣ Check user subscription from JWT
    // Assume JWT contains: { id, subscriptionType }
    const subscriptionType = req.user?.subscriptionType;

    if (!subscriptionType) {
      return res.status(401).json({ message: "Invalid token data" });
    }

    // 4️⃣ If FREE user → serve ad
    if (subscriptionType === "free") {
      const ad = await Ad.findOne();

      if (ad) {
        ad.impressions++;
        await ad.save();
      }

      return res.json({ ad, song });
    }

    // 5️⃣ Premium users → no ads
    return res.json({ song });

  } catch (error) {
    console.error("FULL STREAM ERROR:", error);
    res.status(500).json({ message: "Streaming failed" });
  }
};