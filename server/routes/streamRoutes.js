import express from "express";
import { streamSong } from "../controllers/streamController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:songId", authMiddleware, streamSong);

export default router;