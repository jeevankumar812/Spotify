import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

dotenv.config();
connectDB();

connectRabbitMQ();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.listen(5001, () => {
  console.log("User Service running on port 5001");
});