import Item from "../models/Item.js";
import { compareItems } from "./aiService.js";

export async function findBestMatches(newItem) {
  
  const oppositeType = newItem.type === "lost" ? "found" : "lost";

  const candidates = await Item.find({
    type: oppositeType,
    status: "active",
  });

  const matches = [];

  for (const item of candidates) {
    try {
      const score = await compareItems(
        {
          title: newItem.title,
          description: newItem.description,
          category: newItem.category,
          brand: newItem.brand,
          color: newItem.primaryColor,
          location: newItem.location?.name,
        },
        {
          title: item.title,
          description: item.description,
          category: item.category,
          brand: item.brand,
          color: item.primaryColor,
          location: item.location?.name,
        }
      );

      if (score >= 70) {
        matches.push({
          item: item._id,
          score,
        });
      }
    } catch (err) {
      console.error("AI comparison failed:", err.message);
    }
  }

  matches.sort((a, b) => b.score - a.score);

  return matches.slice(0, 5);
}