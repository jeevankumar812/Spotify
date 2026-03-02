import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

dotenv.config();
connectDB();  // 🔥 REQUIRED

connectRabbitMQ();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/analytics", analyticsRoutes);

app.listen(5006, () => {
  console.log("Analytics Service running on port 5006 🚀");
});