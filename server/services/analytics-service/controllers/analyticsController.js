import mongoose from "mongoose";
import redisClient from "../utils/redisClient.js";

export const getAnalytics = async (req, res) => {
  try {

    // 🔥 1. Check Redis Cache First
    const cachedData = await redisClient.get("analytics:global");

    if (cachedData) {
      console.log("Serving Analytics from Redis 🔥");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Fetching Analytics from MongoDB 🧠");

    const analyticsDB = mongoose.connection.useDb("analyticsDB");

    const stats = await analyticsDB.collection("stats")
      .findOne({ _id: "global" }) || {};

    const topSongs = await analyticsDB.collection("songStats")
      .find()
      .sort({ playCount: -1 })
      .limit(3)
      .toArray();

    const response = {
      totalUsers: stats.totalUsers || 0,
      totalStreams: stats.totalStreams || 0,
      totalAdClicks: stats.totalAdClicks || 0,
      topSongs
    };

    // 🔥 2. Store in Redis with TTL (30 seconds)
    await redisClient.set(
      "analytics:global",
      JSON.stringify(response),
      { EX: 30 }  // expires in 30 seconds
    );

    console.log("Stored Analytics in Redis ✅");

    res.json(response);

  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({ message: "Analytics failed" });
  }
};