import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createClaim,updateClaimStatus} from "../controllers/claimController.js";

const router = express.Router();

router.post("/:itemId",authMiddleware,createClaim);
router.patch("/:id",authMiddleware,updateClaimStatus);

export default router;