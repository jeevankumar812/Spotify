import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  const maxRetries = 10;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      console.log("Connecting to RabbitMQ (Ad Service)...");

      const connection = await amqp.connect("amqp://rabbitmq:5672");
      channel = await connection.createChannel();

      await channel.assertQueue("analytics_queue", { durable: true });

      console.log("RabbitMQ connected (Ad Service) ✅");
      return;

    } catch (error) {
      attempts++;
      console.log(`RabbitMQ not ready (Ad). Retry ${attempts}/10`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.error("Ad Service failed to connect to RabbitMQ ❌");
};

export const publishEvent = async (event) => {
  if (!channel) {
    console.log("Ad channel not ready ❌");
    return;
  }

  console.log("Publishing AD_CLICKED event:", event);

  channel.sendToQueue(
    "analytics_queue",
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
};