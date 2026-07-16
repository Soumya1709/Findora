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
    await Notification.create({
      user,
      title,
      message,
      type,
      claimId,
      item,
      matchedItem,
      matchScore,
    });
  } catch (error) {
    console.error("Notification Error:", error.message);
  }
}