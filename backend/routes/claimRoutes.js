import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createClaim,updateClaimStatus,getMyItemClaims,getClaimById,canViewOwner} from "../controllers/claimController.js";

const router = express.Router();

router.get("/my-item-claims",authMiddleware,getMyItemClaims);
router.get("/:id",authMiddleware,getClaimById);
router.get("/can-view-owner/:itemId",authMiddleware,canViewOwner);
router.post("/:itemId",authMiddleware,createClaim);
router.patch("/:id",authMiddleware,updateClaimStatus);



export default router;