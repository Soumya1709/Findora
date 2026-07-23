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

    const parsedLocation = location ? JSON.parse(location) : {};

    let imageUrl = "";

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

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      imageUrl = result.secure_url;
    }

    const item = await Item.create({
      title,
      description,
      type,
      status: "active",
      category,
      primaryColor,
      brand,
      location: parsedLocation,
      dateLostOrFound,
      images: imageUrl ? [imageUrl] : [],
      reportedBy: req.user.userId,
    });

    const matches = await findBestMatches(item);

    item.matchedItems = matches;

    if (matches.length > 0) {
      item.matchScore = matches[0].score;
    }

    await item.save();

    res.status(201).json({
      success: true,
      message: "Item reported successfully",
      item,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({status: { $ne: "returned" },})
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

export const markItemReturned = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Only the owner can mark it as returned
    if (item.reportedBy.toString() !== req.user.userId) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized",
  });
}
    if (item.status === "returned") {
  return res.status(400).json({
    success: false,
    message: "Item is already marked as returned.",
  });
}
    item.status = "returned";

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item marked as returned",
      item,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
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
  status: { $ne: "returned" },
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

export const getAIMatches = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate({
        path: "matchedItems.item",
        select:
          "title description category brand primaryColor images location type status",
      });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const filteredMatches = item.matchedItems.filter(
  (match) =>
    match.item &&
    match.item.status !== "returned"
);

res.status(200).json({
  success: true,
  matches: filteredMatches,
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
    })
    .populate({
    path: "matchedItems.item",
    select:"title description images location type status",
  })
    .sort({
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


    if (item.status === "returned") {
  return res.status(400).json({
    success: false,
    message: "Returned items cannot be deleted.",
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

    if (item.status === "returned") {
  return res.status(400).json({
    success: false,
    message: "Returned items cannot be edited.",
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