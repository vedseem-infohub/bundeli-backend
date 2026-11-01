import Category from "../models/category.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// Helper to create clean URL slug
const createSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
  }
};

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:idOrSlug
export const getCategoryByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let category = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    }
    if (!category) {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch category", error: error.message });
  }
};

// @desc    Add a new category (with Cloudinary image upload)
// @route   POST /api/categories
export const addCategory = async (req, res) => {
  try {
    const { name, shortDescription, description, artworkCount, featured, order } = req.body;
    let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(name || "");

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Check slug uniqueness
    const existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let imageUrl = req.body.image;
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/categories");
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Category image is required (upload file or image URL)." });
    }

    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      shortDescription: shortDescription || "",
      description: description || "",
      image: imageUrl,
      imagePublicId,
      artworkCount: artworkCount !== undefined ? Number(artworkCount) : 0,
      featured: featured !== undefined ? Boolean(featured) : true,
      order: order !== undefined ? Number(order) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ success: false, message: "Failed to add category", error: error.message });
  }
};

// @desc    Edit / Update a category
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Handle image replacement
    if (req.file) {
      if (category.imagePublicId) {
        await deleteFromCloudinary(category.imagePublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/categories");
      category.image = uploadResult.secure_url;
      category.imagePublicId = uploadResult.public_id;
    } else if (req.body.image) {
      category.image = req.body.image;
    }

    if (req.body.name) {
      category.name = req.body.name.trim();
      if (req.body.slug) {
        category.slug = createSlug(req.body.slug);
      }
    }
    if (req.body.shortDescription !== undefined) category.shortDescription = req.body.shortDescription;
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.artworkCount !== undefined) category.artworkCount = Number(req.body.artworkCount);
    if (req.body.featured !== undefined) category.featured = Boolean(req.body.featured);
    if (req.body.order !== undefined) category.order = Number(req.body.order);

    const updatedCategory = await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ success: false, message: "Failed to update category", error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
  }
};

