import express from "express";
import { clickAd } from "../controllers/adController.js";

const router = express.Router();

router.post("/click/:adId", clickAd);

export default router;