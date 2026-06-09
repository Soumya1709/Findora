import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    // ── Core ──────────────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
   },

    status: {
       type: String,
       enum: ["active", "claimed", "returned"],
       default: "active",
   },

    category: {
      type: String,
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Keys",
        "ID / Cards",
        "Bags",
        "Accessories",
        "Sports",
        "Other",
      ],
      default: "Other",
    },

    // ── Appearance ────────────────────────────────
    primaryColor: {
      type: String,
      default: null,       // e.g. "#000000" or "Black"
    },

    brand: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Location ──────────────────────────────────
    location: {
      name: { type: String, default: null },   // "Main Library Plaza"
      lat:  { type: Number, default: null },
      lng:  { type: Number, default: null },
    },

    // ── Date & Time ───────────────────────────────
    dateLostOrFound: {
      type: Date,
      default: Date.now,
    },
    campusZone: {
       type: String,
       default: "",
   },

    locationNotes: {
      type: String,
     default: "",
   },

    // ── Photos ────────────────────────────────────
    images: {
      type: [String],      // array of URLs / file paths
      default: [],
    },

    // ── Ownership ─────────────────────────────────
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── AI Matching ───────────────────────────────
    matchScore: {
      type: Number,        // 0–100 confidence from AI
      default: 0,
    },

    aiTags: {
      type: [String],
      default: [],
    },

    matchedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    // ── Flags ─────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast status + category queries
itemSchema.index({ status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ reportedBy: 1 });
itemSchema.index({ dateLostOrFound: -1 });

export default mongoose.model("Item", itemSchema);