import Notification from "../models/Notification.js";

export async function createNotification({
  user,
  title,
  message,
  type = "system",
  claimId = null,
  item = null,
  matchedItem = null,
  matchScore = null,
}) {
  try {
    console.log("========== CREATING NOTIFICATION ==========");
    console.log({
      user,
      title,
      message,
      type,
      claimId,
      item,
      matchedItem,
      matchScore,
    });

    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      claimId,
      item,
      matchedItem,
      matchScore,
    });

    console.log("✅ Notification Saved:", notification._id);
  } catch (error) {
    console.error("❌ Notification Error:", error);
  }
}