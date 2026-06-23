import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {updateProfile,} from "../controllers/userController.js";

const router = express.Router();

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

export default router;