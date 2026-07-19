import Item from "../models/Item.js";
import { compareItems } from "./aiService.js";
import { createNotification } from "./notificationService.js";

export async function findBestMatches(newItem) {
  console.log("========== AI MATCHING ==========");

  console.log("New Item:", newItem);

  const oppositeType = newItem.type === "lost" ? "found" : "lost";

  const candidates = await Item.find({
  type: oppositeType,
  reportedBy: { $ne: newItem.reportedBy },
  status: { $ne: "returned" },
  });

  console.log("Candidates Found:", candidates.length);

  const matches = [];

  for (const item of candidates) {

    if (item.status === "returned") {
      continue;
   }

    if (
     item.reportedBy &&
     newItem.reportedBy &&
     item.reportedBy.toString() === newItem.reportedBy.toString()
    ) {
     console.log("Skipping self-reported item");
     continue;
    }
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

      if (score >= 70) {
        matches.push({
          item: item._id,
          score,
        });
         

  
  await createNotification({
    user: item.reportedBy,
    title: "🤖 AI Match Found",
    message: `A newly reported item matches yours with ${score.toFixed(0)}% confidence.`,
    type: "ai_match",
    item: item._id,
    matchedItem: newItem._id,
    matchScore: score,
  });


  }
    } catch (err) {
      console.error("AI Error:", err.response?.data || err.message);
    }
  }

  console.log("Final Matches:", matches);
  
matches.sort((a, b) => b.score - a.score);


const topMatches = matches.slice(0, 3);


for (const match of topMatches) {
  await createNotification({
    user: newItem.reportedBy,
    title: "🤖 AI Match Found",
    message: `We found a ${match.score.toFixed(0)}% match for your reported item.`,
    type: "ai_match",
    item: newItem._id,
    matchedItem: match.item,
    matchScore: match.score,
  });
}

  return topMatches;
}