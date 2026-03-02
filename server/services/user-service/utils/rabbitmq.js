import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  const maxRetries = 10;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      console.log("Connecting to RabbitMQ (User Service)...");

      const connection = await amqp.connect("amqp://rabbitmq:5672");
      channel = await connection.createChannel();

      await channel.assertQueue("analytics_queue", { durable: true });

      console.log("RabbitMQ connected (User Service) ✅");
      return;

    } catch (error) {
      attempts++;
      console.log(`RabbitMQ not ready (User). Retry ${attempts}/10`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.error("User Service failed to connect to RabbitMQ ❌");
};

export const publishEvent = async (event) => {
  if (!channel) {
    console.log("User channel not ready ❌");
    return;
  }

  console.log("Publishing USER_REGISTERED event:", event);

  channel.sendToQueue(
    "analytics_queue",
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
};