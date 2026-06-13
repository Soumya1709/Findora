import Item from "../models/Item.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

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
    const parsedLocation = location
  ? JSON.parse(location)
  : {};
  

  let imageUrl = "";

if (req.file) {
  ;
  const result = await new Promise((resolve, reject) => {
    
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "findora",
      },
      (error, result) => {
        

        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier
      .createReadStream(req.file.buffer)
      .pipe(stream);
  });

  imageUrl = result.secure_url;
}

const item = await Item.create({
  title,
  description,
  type,
  category,
  primaryColor,
  brand,
  location:parsedLocation,
  dateLostOrFound,

  images: imageUrl ? [imageUrl] : [],

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
     console.log("Delete ID:", req.params.id);
    const item = await Item.findById(req.params.id);
    console.log("Found Item:", item);

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

export const updateItem = async (req, res) => {
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

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};