import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();  // 🔥 REQUIRED

const app = express();

app.use(cors());
app.use(express.json());

app.use("/analytics", analyticsRoutes);

app.listen(5006, () => {
  console.log("Analytics Service running on port 5006 🚀");
});