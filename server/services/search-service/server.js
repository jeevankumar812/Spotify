import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();
connectDB();  // 🔥 IMPORTANT

const app = express();

app.use(cors());
app.use(express.json());

app.use("/search", searchRoutes);

app.listen(5004, () => {
  console.log("Search Service running on port 5004 🚀");
});