import amqp from "amqplib";
import mongoose from "mongoose";
import redisClient from "./redisClient.js";

export const connectRabbitMQ = async () => {
  const maxRetries = 10;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      console.log("Connecting to RabbitMQ (Analytics)...");

      const connection = await amqp.connect("amqp://rabbitmq:5672");
      const channel = await connection.createChannel();

      await channel.assertQueue("analytics_queue", { durable: true });

      console.log("RabbitMQ connected (Analytics) ✅");

      channel.consume("analytics_queue", async (msg) => {
        if (!msg) return;

        try {
          const event = JSON.parse(msg.content.toString());
          console.log("Received Event:", event);

          const analyticsDB = mongoose.connection.useDb("analyticsDB");

          // Always store raw event
          await analyticsDB.collection("events").insertOne(event);

          // --------------------------
          // USER_REGISTERED
          // --------------------------
          if (event.type === "USER_REGISTERED") {
            await analyticsDB.collection("stats").updateOne(
              { _id: "global" },
              { $inc: { totalUsers: 1 } },
              { upsert: true }
            );
          }

          // --------------------------
          // SONG_PLAYED
          // --------------------------
          if (event.type === "SONG_PLAYED") {
            await analyticsDB.collection("stats").updateOne(
              { _id: "global" },
              { $inc: { totalStreams: 1 } },
              { upsert: true }
            );

            await analyticsDB.collection("songStats").updateOne(
              { songId: event.songId },
              { $inc: { playCount: 1 } },
              { upsert: true }
            );
          }

          // --------------------------
          // AD_CLICKED
          // --------------------------
          if (event.type === "AD_CLICKED") {
            await analyticsDB.collection("stats").updateOne(
              { _id: "global" },
              { $inc: { totalAdClicks: 1 } },
              { upsert: true }
            );

            await analyticsDB.collection("adStats").updateOne(
              { adId: event.adId },
              { $inc: { clicks: 1 } },
              { upsert: true }
            );
          }

          // 🔥 CACHE INVALIDATION (VERY IMPORTANT)
          await redisClient.del("analytics:global");
          console.log("Redis cache invalidated 🔄");

          channel.ack(msg);

        } catch (err) {
          console.error("Event processing error:", err);
        }
      });

      return;

    } catch (error) {
      attempts++;
      console.log(`RabbitMQ not ready (Analytics). Retry ${attempts}/10`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.error("Failed to connect to RabbitMQ (Analytics) ❌");
};