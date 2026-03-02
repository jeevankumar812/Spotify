import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import streamRoutes from "./routes/streamRoutes.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

dotenv.config();
connectDB();   // 🔥 MUST BE HERE

connectRabbitMQ();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/stream", streamRoutes);

app.listen(5002, () => {
  console.log("Streaming Service running on port 5002");
});