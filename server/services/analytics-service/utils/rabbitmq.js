import amqp from "amqplib";
import mongoose from "mongoose";

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

        const event = JSON.parse(msg.content.toString());
        console.log("Received Event:", event);

        const analyticsDB = mongoose.connection.useDb("analyticsDB");

        if (event.type === "SONG_PLAYED") {
          await analyticsDB.collection("events").insertOne(event);
        }

        channel.ack(msg);
      });

      return;

    } catch (error) {
      attempts++;
      console.log(`RabbitMQ not ready (Analytics). Retry ${attempts}/${maxRetries}`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.error("Failed to connect to RabbitMQ (Analytics) ❌");
};