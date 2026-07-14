import Item from "../models/Item.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { findBestMatches } from "../services/aiMatcher.js";



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
    
const matches = await findBestMatches(item);

item.matchedItems = matches;

await item.save();

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


export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "fullName email phoneNumber");

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

export const getSimilarItems = async (
  req,
  res
) => {
  try {
    const currentItem =
      await Item.findById(req.params.id);

    if (!currentItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const similarItems = await Item.find({
  _id: { $ne: currentItem._id },

  category: currentItem.category,

  type: {
    $ne: currentItem.type,
  },
})
.limit(4)
.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items: similarItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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

    const {
      title,
      description,
      type,
      category,
      primaryColor,
      brand,
      location,
      campusZone,
      locationNotes,
      dateLostOrFound,
    } = req.body;

    const parsedLocation = location
      ? JSON.parse(location)
      : item.location;

    const parsedDate = dateLostOrFound
      ? new Date(dateLostOrFound)
      : item.dateLostOrFound;

    const updateData = {
      title: title ?? item.title,
      description: description ?? item.description,
      type: type ?? item.type,
      category: category ?? item.category,
      primaryColor: primaryColor ?? item.primaryColor,
      brand: brand ?? item.brand,
      location: parsedLocation,
      campusZone: campusZone ?? item.campusZone,
      locationNotes: locationNotes ?? item.locationNotes,
      dateLostOrFound: isNaN(parsedDate) ? item.dateLostOrFound : parsedDate,
    };

    if (req.file) {
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

      updateData.images = item.images?.length
        ? [...item.images, result.secure_url]
        : [result.secure_url];
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
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