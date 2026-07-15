import Item from "../models/Item.js";
import { compareItems } from "./aiService.js";

export async function findBestMatches(newItem) {
  console.log("========== AI MATCHING ==========");

  console.log("New Item:", newItem);

  const oppositeType = newItem.type === "lost" ? "found" : "lost";

  const candidates = await Item.find({
    type: oppositeType,
  });

  console.log("Candidates Found:", candidates.length);

  const matches = [];

  for (const item of candidates) {
    const payload1 = {
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      brand: newItem.brand,
      color: newItem.primaryColor,
      location: newItem.location?.name,
    };

    const payload2 = {
      title: item.title,
      description: item.description,
      category: item.category,
      brand: item.brand,
      color: item.primaryColor,
      location: item.location?.name,
    };

    console.log("Payload 1:", payload1);
    console.log("Payload 2:", payload2);

    try {
      const score = await compareItems(payload1, payload2);

      console.log("Similarity:", score);

      if (score >= 50) {
        matches.push({
          item: item._id,
          score,
        });
      }
    } catch (err) {
      console.error("AI Error:", err.response?.data || err.message);
    }
  }

  console.log("Final Matches:", matches);

  return matches;
}