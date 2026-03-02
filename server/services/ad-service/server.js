import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adRoutes from "./routes/adRoutes.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

dotenv.config();
connectDB();  // 🔥 IMPORTANT

connectRabbitMQ();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/ads", adRoutes);

app.listen(5003, () => {
  console.log("Ad Service running on port 5003 🚀");
});