import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  deleteItem,
  updateItem,
} from "../controllers/itemController.js";

const router = express.Router();

router.post("/", authMiddleware, createItem);

router.get("/", getAllItems);

router.get("/my-items", authMiddleware, getMyItems);

router.get("/:id", getItemById);

router.delete("/:id", authMiddleware, deleteItem);
router.put("/:id", authMiddleware, updateItem);

export default router;