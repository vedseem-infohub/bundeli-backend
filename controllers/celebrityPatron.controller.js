import CelebrityPatron from "../models/celebrityPatron.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// @desc    Get all paintings sold to celebrities / celebrated patrons
// @route   GET /api/celebrity-paintings
export const getCelebrityPaintings = async (req, res) => {
  try {
    const list = await CelebrityPatron.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error("Error fetching celebrity paintings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch celebrity paintings",
      error: error.message,
    });
  }
};

// @desc    Get single celebrity acquisition by ID
// @route   GET /api/celebrity-paintings/:id
export const getCelebrityPaintingById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CelebrityPatron.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch item", error: error.message });
  }
};

// @desc    Add a new celebrated patron acquisition (with Cloudinary image upload)
// @route   POST /api/celebrity-paintings
export const addCelebrityPainting = async (req, res) => {
  try {
    const {
      celebrityName,
      celebrityTitle,
      location,
      artworkTitle,
      artist,
      medium,
      dimensions,
      year,
      quote,
      artworkSlug,
      tag,
      order,
    } = req.body;

    if (!celebrityName || !artworkTitle) {
      return res.status(400).json({
        success: false,
        message: "Celebrity name and artwork title are required.",
      });
    }

    let imageUrl = req.body.image;
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/celebrities");
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Artwork / Patron showcase image is required (upload file or image URL).",
      });
    }

    const newRecord = await CelebrityPatron.create({
      celebrityName: celebrityName.trim(),
      celebrityTitle: celebrityTitle || "Royal Patron & Cultural Icon",
      location: location || "",
      artworkTitle: artworkTitle.trim(),
      artist: artist || "Bundeli Master Atelier",
      medium: medium || "Natural Mineral Pigments & 24K Gold Leaf on Wasli Paper",
      dimensions: dimensions || "",
      year: year || new Date().getFullYear().toString(),
      image: imageUrl,
      imagePublicId,
      quote: quote || "",
      artworkSlug: artworkSlug || "",
      tag: tag || "Bespoke Royal Acquisition",
      order: order !== undefined ? Number(order) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Celebrity acquisition record created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error adding celebrity painting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add celebrity painting",
      error: error.message,
    });
  }
};

// @desc    Edit / Update a celebrated patron acquisition
// @route   PUT /api/celebrity-paintings/:id
export const updateCelebrityPainting = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CelebrityPatron.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (req.file) {
      if (item.imagePublicId) {
        await deleteFromCloudinary(item.imagePublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/celebrities");
      item.image = uploadResult.secure_url;
      item.imagePublicId = uploadResult.public_id;
    } else if (req.body.image) {
      item.image = req.body.image;
    }

    if (req.body.celebrityName) item.celebrityName = req.body.celebrityName.trim();
    if (req.body.celebrityTitle !== undefined) item.celebrityTitle = req.body.celebrityTitle;
    if (req.body.location !== undefined) item.location = req.body.location;
    if (req.body.artworkTitle) item.artworkTitle = req.body.artworkTitle.trim();
    if (req.body.artist !== undefined) item.artist = req.body.artist;
    if (req.body.medium !== undefined) item.medium = req.body.medium;
    if (req.body.dimensions !== undefined) item.dimensions = req.body.dimensions;
    if (req.body.year !== undefined) item.year = req.body.year;
    if (req.body.quote !== undefined) item.quote = req.body.quote;
    if (req.body.artworkSlug !== undefined) item.artworkSlug = req.body.artworkSlug;
    if (req.body.tag !== undefined) item.tag = req.body.tag;
    if (req.body.order !== undefined) item.order = Number(req.body.order);

    const updated = await item.save();

    return res.status(200).json({
      success: true,
      message: "Celebrity acquisition record updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating celebrity painting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update celebrity painting",
      error: error.message,
    });
  }
};

// @desc    Delete a celebrated patron acquisition
// @route   DELETE /api/celebrity-paintings/:id
export const deleteCelebrityPainting = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CelebrityPatron.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    await CelebrityPatron.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Celebrity acquisition record deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting celebrity painting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete celebrity painting",
      error: error.message,
    });
  }
};

