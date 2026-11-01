import Blog from "../models/blog.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

const createSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// @desc    Get all blogs / journal essays
// @route   GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) filter.category = new RegExp(category, "i");
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { summary: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch blogs", error: error.message });
  }
};

// @desc    Get single blog by ID or slug
// @route   GET /api/blogs/:idOrSlug
export const getBlogByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let blog = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(idOrSlug);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog essay not found" });
    }

    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch blog", error: error.message });
  }
};

// @desc    Add a new blog / journal essay (with Cloudinary image upload)
// @route   POST /api/blogs
export const addBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      date,
      readTime,
      author,
      authorRole,
      summary,
      content,
      relatedArtworks,
      published,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Blog title is required" });
    }

    let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let coverImageUrl = req.body.coverImage || req.body.image;
    let coverImagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/blogs");
      coverImageUrl = uploadResult.secure_url;
      coverImagePublicId = uploadResult.public_id;
    }

    if (!coverImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required (upload file or provide image URL).",
      });
    }

    let parsedRelated = relatedArtworks;
    if (typeof relatedArtworks === "string") {
      try {
        parsedRelated = JSON.parse(relatedArtworks);
      } catch {
        parsedRelated = [relatedArtworks];
      }
    }

    const newBlog = await Blog.create({
      title: title.trim(),
      slug,
      category: category || "Heritage & History",
      date:
        date ||
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      readTime: readTime || "6 min read",
      author: author || "Bundeli Kalavrat Curatorial Guild",
      authorRole: authorRole || "Senior Curator & Art Historian",
      coverImage: coverImageUrl,
      coverImagePublicId,
      summary: summary || "",
      content: content || "",
      relatedArtworks: Array.isArray(parsedRelated) ? parsedRelated : [],
      published: published !== undefined ? (published === "true" || published === true) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Blog article created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error adding blog:", error);
    return res.status(500).json({ success: false, message: "Failed to add blog", error: error.message });
  }
};

// @desc    Edit / Update a blog article
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog article not found" });
    }

    if (req.file) {
      if (blog.coverImagePublicId) {
        await deleteFromCloudinary(blog.coverImagePublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/blogs");
      blog.coverImage = uploadResult.secure_url;
      blog.coverImagePublicId = uploadResult.public_id;
    } else if (req.body.coverImage || req.body.image) {
      blog.coverImage = req.body.coverImage || req.body.image;
    }

    if (req.body.title) {
      blog.title = req.body.title.trim();
      if (req.body.slug) blog.slug = createSlug(req.body.slug);
    }
    if (req.body.category !== undefined) blog.category = req.body.category;
    if (req.body.date !== undefined) blog.date = req.body.date;
    if (req.body.readTime !== undefined) blog.readTime = req.body.readTime;
    if (req.body.author !== undefined) blog.author = req.body.author;
    if (req.body.authorRole !== undefined) blog.authorRole = req.body.authorRole;
    if (req.body.summary !== undefined) blog.summary = req.body.summary;
    if (req.body.content !== undefined) blog.content = req.body.content;
    if (req.body.published !== undefined)
      blog.published = req.body.published === "true" || req.body.published === true;

    if (req.body.relatedArtworks) {
      let parsedRelated = req.body.relatedArtworks;
      if (typeof parsedRelated === "string") {
        try {
          parsedRelated = JSON.parse(parsedRelated);
        } catch {
          parsedRelated = [parsedRelated];
        }
      }
      if (Array.isArray(parsedRelated)) blog.relatedArtworks = parsedRelated;
    }

    const updated = await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog article updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ success: false, message: "Failed to update blog", error: error.message });
  }
};

// @desc    Delete a blog article
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog article not found" });
    }

    if (blog.coverImagePublicId) {
      await deleteFromCloudinary(blog.coverImagePublicId);
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog article deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ success: false, message: "Failed to delete blog", error: error.message });
  }
};

