import { compareItems } from "./services/aiService.js";
const item1 = {
  title: "Black Wildcraft Backpack",
  description: "Contains Dell laptop and charger",
  category: "Bags",
  brand: "Wildcraft",
  color: "Black",
  location: "Central Library",
};

const item2 = {
  title: "Black College Backpack",
  description: "Laptop bag found near library",
  category: "Bags",
  brand: "Wildcraft",
  color: "Black",
  location: "Library",
};

const score = await compareItems(item1, item2);

console.log(score);