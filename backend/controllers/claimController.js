import Claim from "../models/Claim.js";
import Item from "../models/Item.js";
import Notification from "../models/Notification.js";

export const createClaim = async (
  req,res) => {
  try {
    const item = await Item.findById(
      req.params.itemId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const claim = await Claim.create({
      item: item._id,
      claimant: req.user.userId,
    });

    await Notification.create({
      user: item.reportedBy,

      title: "New Claim Request",

      message:
        "A user believes this item belongs to them.",
    });

    res.status(201).json({
      success: true,
      claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};