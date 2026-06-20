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

export const updateClaimStatus = async (req,res) => {
  try {
    const { status } = req.body;

    const claim =
      await Claim.findById(req.params.id)
        .populate("item")
        .populate("claimant");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    claim.status = status;

    await claim.save();

    await Notification.create({
      user: claim.claimant._id,

      title:
        status === "approved"
          ? "Claim Approved"
          : "Claim Rejected",

      message:
        status === "approved"
          ? "Your claim has been approved."
          : "Your claim has been rejected.",
    });

    res.status(200).json({
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

export const getMyItemClaims = async (req,res) => {
  try {
    const claims = await Claim.find()
      .populate("item")
      .populate("claimant");

    const myClaims = claims.filter(
      (claim) =>
        claim.item.reportedBy.toString() ===
        req.user.userId
    );

    res.status(200).json({
      success: true,
      claims: myClaims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getClaimById = async (req,res) => {
  try {
    const claim = await Claim.findById(
      req.params.id
    )
      .populate("item")
      .populate("claimant");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    res.status(200).json({
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