import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyNotifications,markAsRead } from "../controllers/notificationController.js";


const router = express.Router();

router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read",authMiddleware,markAsRead);

export default router;