import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  deleteItem,
  updateItem,
  getSimilarItems
} from "../controllers/itemController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createItem
);

router.get("/", getAllItems);

router.get("/my-items", authMiddleware, getMyItems);

router.get("/similar/:id", getSimilarItems);
router.get("/:id", getItemById);

router.delete("/:id", authMiddleware, deleteItem);
router.put("/:id", authMiddleware, upload.single("image"), updateItem);

export default router;