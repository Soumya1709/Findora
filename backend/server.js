import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();





import cloudinary from "./config/cloudinary.js";
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Findora API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get(
  "/api/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected Route Accessed",
      user: req.user,
    });
  }
);