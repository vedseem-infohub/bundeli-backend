import News from "../models/news.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

const createSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// @desc    Get all news dispatches
// @route   GET /api/news
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, count: news.length, data: news });
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch news", error: error.message });
  }
};

// @desc    Get single news article by ID or slug
// @route   GET /api/news/:idOrSlug
export const getNewsByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let item = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      item = await News.findById(idOrSlug);
    }
    if (!item) {
      item = await News.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!item) {
      return res.status(404).json({ success: false, message: "News item not found" });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching news item:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch news item", error: error.message });
  }
};

// @desc    Add a new news dispatch (with Cloudinary image upload)
// @route   POST /api/news
export const addNews = async (req, res) => {
  try {
    const { title, badge, outlet, date, readTime, summary, content, link, order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "News title is required" });
    }

    let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
    const existing = await News.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let imageUrl = req.body.image;
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/news");
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "News image is required (upload file or image URL).",
      });
    }

    const newNews = await News.create({
      title: title.trim(),
      slug,
      badge: badge || "PRESS & DISPATCH",
      outlet: outlet || "Bundeli Kalavrat Press",
      date:
        date ||
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      readTime: readTime || "4 min read",
      image: imageUrl,
      imagePublicId,
      summary: summary || "",
      content: content || "",
      link: link || "",
      order: order !== undefined ? Number(order) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "News dispatch created successfully",
      data: newNews,
    });
  } catch (error) {
    console.error("Error adding news:", error);
    return res.status(500).json({ success: false, message: "Failed to add news", error: error.message });
  }
};

// @desc    Edit / Update a news dispatch
// @route   PUT /api/news/:id
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await News.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "News item not found" });
    }

    if (req.file) {
      if (item.imagePublicId) {
        await deleteFromCloudinary(item.imagePublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/news");
      item.image = uploadResult.secure_url;
      item.imagePublicId = uploadResult.public_id;
    } else if (req.body.image) {
      item.image = req.body.image;
    }

    if (req.body.title) {
      item.title = req.body.title.trim();
      if (req.body.slug) item.slug = createSlug(req.body.slug);
    }
    if (req.body.badge !== undefined) item.badge = req.body.badge;
    if (req.body.outlet !== undefined) item.outlet = req.body.outlet;
    if (req.body.date !== undefined) item.date = req.body.date;
    if (req.body.readTime !== undefined) item.readTime = req.body.readTime;
    if (req.body.summary !== undefined) item.summary = req.body.summary;
    if (req.body.content !== undefined) item.content = req.body.content;
    if (req.body.link !== undefined) item.link = req.body.link;
    if (req.body.order !== undefined) item.order = Number(req.body.order);

    const updated = await item.save();

    return res.status(200).json({
      success: true,
      message: "News dispatch updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating news:", error);
    return res.status(500).json({ success: false, message: "Failed to update news", error: error.message });
  }
};

// @desc    Delete a news dispatch
// @route   DELETE /api/news/:id
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await News.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: "News item not found" });
    }

    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    await News.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "News dispatch deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    return res.status(500).json({ success: false, message: "Failed to delete news", error: error.message });
  }
};

