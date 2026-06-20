import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createClaim,updateClaimStatus,getMyItemClaims,getClaimById} from "../controllers/claimController.js";

const router = express.Router();

router.post("/:itemId",authMiddleware,createClaim);
router.patch("/:id",authMiddleware,updateClaimStatus);
router.get("/my-item-claims",authMiddleware,getMyItemClaims);
router.get("/:id",authMiddleware,getClaimById);

export default router;