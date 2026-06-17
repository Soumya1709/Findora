import express from "express";
import { registerUser,loginUser } from "../controllers/authController.js";
import { googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/google",googleLogin);

export default router;