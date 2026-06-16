import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createClaim } from "../controllers/claimController.js";

const router = express.Router();

router.post("/:itemId",authMiddleware,createClaim);

export default router;