import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
    },

    studentId: {
      type: String,
      sparse: true,
      unique: true,
    },


    role: {
      type: String,
      enum: ["student", "admin", "security"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    collegeName: {
      type: String,
      default: null,
    },

    profilePicture: {
       type: String,
       default: null,
   },

    notificationPrefs: {
      email: { type: Boolean, default: true },
      push:  { type: Boolean, default: true },
      sms:   { type: Boolean, default: false },
    },

    stats: {
      itemsReported:  { type: Number, default: 0 },
      itemsRecovered: { type: Number, default: 0 },
    },

    oauthProvider: {
      type: String,
      enum: ["local", "google", "microsoft"],
      default: "local",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);