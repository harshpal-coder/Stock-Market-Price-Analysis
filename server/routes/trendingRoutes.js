// server/routes/trendingRoutes.js
import express from "express";
import { fetchTrendingStocks } from "../controllers/trendingController.js";

const router = express.Router();
router.get("/trending", fetchTrendingStocks);
export default router;
