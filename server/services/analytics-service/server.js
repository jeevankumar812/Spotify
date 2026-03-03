import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/analytics", analyticsRoutes);

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");

    await connectRabbitMQ();

    app.listen(5006, () => {
      console.log("Analytics Service running on port 5006 🚀");
    });

  } catch (error) {
    console.error("Startup Error:", error);
    process.exit(1);
  }
};

startServer();