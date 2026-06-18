import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getMyNotifications);

export default router;