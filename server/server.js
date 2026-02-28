import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adRoutes from "./routes/adRoutes.js";



dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ads", adRoutes);

app.listen(5000, () => console.log("Server running on port 5000 🚀"));