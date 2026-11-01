import Achievement from "../models/achievement.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// @desc    Get all achievements (stats & milestones)
// @route   GET /api/achievements
export const getAchievements = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;

    const achievements = await Achievement.find(filter).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch achievements", error: error.message });
  }
};

// @desc    Add a new achievement (stat or milestone)
// @route   POST /api/achievements
export const addAchievement = async (req, res) => {
  try {
    const { type, title, number, label, badge, detail, description, icon, order, isActive } = req.body;

    let imageUrl = req.body.image || "";
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/achievements");
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const newAchievement = await Achievement.create({
      type: type || "milestone",
      title: title || "",
      number: number || "",
      label: label || "",
      badge: badge || "",
      detail: detail || "",
      description: description || "",
      icon: icon || "Award",
      image: imageUrl,
      imagePublicId,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      data: newAchievement,
    });
  } catch (error) {
    console.error("Error adding achievement:", error);
    return res.status(500).json({ success: false, message: "Failed to add achievement", error: error.message });
  }
};

// @desc    Edit / Update an achievement
// @route   PUT /api/achievements/:id
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Achievement.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Achievement not found" });
    }

    if (req.file) {
      if (item.imagePublicId) {
        await deleteFromCloudinary(item.imagePublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/achievements");
      item.image = uploadResult.secure_url;
      item.imagePublicId = uploadResult.public_id;
    } else if (req.body.image) {
      item.image = req.body.image;
    }

    if (req.body.type !== undefined) item.type = req.body.type;
    if (req.body.title !== undefined) item.title = req.body.title;
    if (req.body.number !== undefined) item.number = req.body.number;
    if (req.body.label !== undefined) item.label = req.body.label;
    if (req.body.badge !== undefined) item.badge = req.body.badge;
    if (req.body.detail !== undefined) item.detail = req.body.detail;
    if (req.body.description !== undefined) item.description = req.body.description;
    if (req.body.icon !== undefined) item.icon = req.body.icon;
    if (req.body.order !== undefined) item.order = Number(req.body.order);
    if (req.body.isActive !== undefined) item.isActive = Boolean(req.body.isActive);

    const updated = await item.save();

    return res.status(200).json({
      success: true,
      message: "Achievement updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating achievement:", error);
    return res.status(500).json({ success: false, message: "Failed to update achievement", error: error.message });
  }
};

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Achievement.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Achievement not found" });
    }

    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    await Achievement.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Achievement deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return res.status(500).json({ success: false, message: "Failed to delete achievement", error: error.message });
  }
};

