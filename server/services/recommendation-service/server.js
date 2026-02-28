import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();
connectDB();  // 🔥 REQUIRED

const app = express();

app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRoutes);

app.listen(5005, () => {
  console.log("Recommendation Service running on port 5005 🚀");
});