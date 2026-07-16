import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Receiver
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification Heading
    title: {
      type: String,
      required: true,
    },

    // Notification Body
    message: {
      type: String,
      required: true,
    },

    // Notification Type
    type: {
      type: String,
      enum: [
        "claim_request",
        "claim_approved",
        "claim_rejected",
        "ai_match",
        "system",
      ],
      default: "system",
    },

    // Claim Notifications
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      default: null,
    },

    // AI Match Notifications
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    matchedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    matchScore: {
      type: Number,
      default: null,
    },

    // Read Status
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);