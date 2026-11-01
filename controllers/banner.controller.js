import Banner from "../models/banner.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// @desc    Get all hero banners
// @route   GET /api/banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch banners", error: error.message });
  }
};

// @desc    Get active banners for public hero slider
// @route   GET /api/banners/active
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    console.error("Error fetching active banners:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch active banners", error: error.message });
  }
};

// @desc    Add a new hero banner (with Cloudinary image upload)
// @route   POST /api/banners
export const addBanner = async (req, res) => {
  try {
    let imageUrl = req.body.image;
    let imagePublicId = "";

    // If an image file was uploaded via Multer
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/banners");
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Banner image is required (upload file or image URL)." });
    }

    const newBanner = await Banner.create({
      title: req.body.title || "",
      subtitle: req.body.subtitle || "",
      image: imageUrl,
      imagePublicId,
      alt: req.body.alt || req.body.title || "Bundeli Kalavrat Hero Banner",
      link: req.body.link || "",
      order: req.body.order !== undefined ? Number(req.body.order) : 0,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Hero banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    console.error("Error adding banner:", error);
    return res.status(500).json({ success: false, message: "Failed to add banner", error: error.message });
  }
};

// @desc    Edit / Update an existing hero banner
// @route   PUT /api/banners/:id
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Check if new image file is uploaded
    if (req.file) {
      // Delete previous image from Cloudinary if existed
      if (banner.imagePublicId) {
        await deleteFromCloudinary(banner.imagePublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/banners");
      banner.image = uploadResult.secure_url;
      banner.imagePublicId = uploadResult.public_id;
    } else if (req.body.image) {
      banner.image = req.body.image;
    }

    if (req.body.title !== undefined) banner.title = req.body.title;
    if (req.body.subtitle !== undefined) banner.subtitle = req.body.subtitle;
    if (req.body.alt !== undefined) banner.alt = req.body.alt;
    if (req.body.link !== undefined) banner.link = req.body.link;
    if (req.body.order !== undefined) banner.order = Number(req.body.order);
    if (req.body.isActive !== undefined) banner.isActive = Boolean(req.body.isActive);

    const updatedBanner = await banner.save();

    return res.status(200).json({
      success: true,
      message: "Hero banner updated successfully",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    return res.status(500).json({ success: false, message: "Failed to update banner", error: error.message });
  }
};

// @desc    Delete a hero banner
// @route   DELETE /api/banners/:id
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Remove asset from Cloudinary
    if (banner.imagePublicId) {
      await deleteFromCloudinary(banner.imagePublicId);
    }

    await Banner.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Hero banner deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return res.status(500).json({ success: false, message: "Failed to delete banner", error: error.message });
  }
};

