import express from "express";
import { streamSong } from "../controllers/streamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:songId", protect, streamSong);

export default router;