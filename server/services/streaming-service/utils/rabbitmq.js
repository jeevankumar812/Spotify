import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  const maxRetries = 10;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect("amqp://rabbitmq:5672");
      channel = await connection.createChannel();

      await channel.assertQueue("analytics_queue", { durable: true });

      console.log("RabbitMQ connected (Streaming) ✅");
      return;

    } catch (error) {
      attempts++;
      console.log(`RabbitMQ not ready. Retry ${attempts}/${maxRetries}`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.error("Failed to connect to RabbitMQ after retries ❌");
};

export const publishEvent = async (event) => {
  if (!channel) {
    console.log("Channel not ready ❌");
    return;
  }

  console.log("Publishing Event:", event);

  channel.sendToQueue(
    "analytics_queue",
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
};