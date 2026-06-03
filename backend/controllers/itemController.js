import Item from "../models/Item.js";

// Create Item
export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      primaryColor,
      brand,
      location,
      dateLostOrFound,
    } = req.body;

    const item = await Item.create({
      title,
      description,
      type,
      category,
      primaryColor,
      brand,
      location,
      dateLostOrFound,

      reportedBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Item reported successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Item
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "fullName email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged In User's Items
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      reportedBy: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (
      item.reportedBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};