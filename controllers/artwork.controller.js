import Artwork from "../models/artwork.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

const createSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// @desc    Get all artworks (with optional query filters: category, isNew, isFeatured, search)
// @route   GET /api/artworks
export const getArtworks = async (req, res) => {
  try {
    const { category, isNew, isFeatured, search } = req.query;
    const filter = {};

    if (category) {
      filter.$or = [
        { category: new RegExp(category, "i") },
        { categorySlug: category.toLowerCase() },
      ];
    }
    if (isNew !== undefined) {
      filter.isNew = isNew === "true" || isNew === true;
    }
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { artist: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const artworks = await Artwork.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: artworks.length, data: artworks });
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch artworks", error: error.message });
  }
};

// @desc    Get New Arrivals
// @route   GET /api/artworks/new-arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const artworks = await Artwork.find({ isNew: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: artworks.length, data: artworks });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch new arrivals", error: error.message });
  }
};

// @desc    Get single artwork by ID or slug
// @route   GET /api/artworks/:idOrSlug
export const getArtworkByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let artwork = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      artwork = await Artwork.findById(idOrSlug);
    }
    if (!artwork) {
      artwork = await Artwork.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!artwork) {
      return res.status(404).json({ success: false, message: "Artwork not found" });
    }

    return res.status(200).json({ success: true, data: artwork });
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch artwork", error: error.message });
  }
};

// @desc    Add a new artwork (with Cloudinary image uploads)
// @route   POST /api/artworks
export const addArtwork = async (req, res) => {
  try {
    const {
      title,
      artist,
      category,
      categorySlug,
      style,
      collectionName,
      collectionSlug,
      description,
      story,
      price,
      originalPrice,
      isPriceOnRequest,
      medium,
      material,
      dimensions,
      orientation,
      size,
      availability,
      isNew,
      isFeatured,
      isLimitedEdition,
      sku,
      specs,
    } = req.body;

    if (!title || !artist || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, artist, and category are required fields.",
      });
    }

    let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
    const existing = await Artwork.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Process images
    const imageList = [];

    // If multiple files uploaded via req.files (e.g. uploadMultiple('images'))
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, "bundeli/artworks");
        imageList.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      }
    } else if (req.file) {
      // Single file upload via req.file
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/artworks");
      imageList.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }

    // Also support image URLs passed as strings or array of URLs in body
    if (req.body.images) {
      let bodyImages = req.body.images;
      if (typeof bodyImages === "string") {
        try {
          bodyImages = JSON.parse(bodyImages);
        } catch {
          bodyImages = [bodyImages];
        }
      }
      if (Array.isArray(bodyImages)) {
        bodyImages.forEach((img) => {
          if (typeof img === "string" && img.trim()) {
            imageList.push({ url: img.trim(), publicId: "" });
          } else if (img && typeof img === "object" && img.url) {
            imageList.push({ url: img.url, publicId: img.publicId || "" });
          }
        });
      }
    }

    if (imageList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one artwork image is required.",
      });
    }

    // Parse specs if sent as string from form data
    let parsedSpecs = specs;
    if (typeof specs === "string") {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch {
        parsedSpecs = {};
      }
    }

    const newArtwork = await Artwork.create({
      title: title.trim(),
      slug,
      artist: artist.trim(),
      artistSlug: createSlug(artist),
      category: category.trim(),
      categorySlug: categorySlug ? createSlug(categorySlug) : createSlug(category),
      style: style || "Bundelkhand Royal Traditional",
      collectionName: collectionName || "The Bundelkhand Heritage Collection",
      collectionSlug: collectionSlug || "bundelkhand-heritage",
      description: description || "",
      story: story || "",
      price: price ? Number(price) : 0,
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      isPriceOnRequest: isPriceOnRequest !== undefined ? Boolean(isPriceOnRequest) : false,
      images: imageList,
      medium: medium || "Natural Mineral Pigments & Gold Leaf",
      material: material || "Handmade Sanganeri Wasli Paper",
      dimensions: dimensions || '36" x 48"',
      orientation: orientation || "Landscape",
      size: size || "Medium",
      availability: availability || "In Stock",
      isNew: isNew !== undefined ? (isNew === "true" || isNew === true) : false,
      isFeatured: isFeatured !== undefined ? (isFeatured === "true" || isFeatured === true) : false,
      isLimitedEdition: isLimitedEdition !== undefined ? (isLimitedEdition === "true" || isLimitedEdition === true) : false,
      sku: sku || `BK-${Date.now().toString().slice(-6)}`,
      specs: parsedSpecs || {},
    });

    return res.status(201).json({
      success: true,
      message: "Artwork created successfully",
      data: newArtwork,
    });
  } catch (error) {
    console.error("Error adding artwork:", error);
    return res.status(500).json({ success: false, message: "Failed to add artwork", error: error.message });
  }
};

// @desc    Edit / Update an existing artwork
// @route   PUT /api/artworks/:id
export const updateArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({ success: false, message: "Artwork not found" });
    }

    // If new image files are uploaded, upload them
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, "bundeli/artworks");
        newImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      }
      // Replace or append
      if (req.body.replaceImages === "true" || req.body.replaceImages === true) {
        // Delete old Cloudinary assets
        for (const img of artwork.images) {
          if (img.publicId) await deleteFromCloudinary(img.publicId);
        }
        artwork.images = newImages;
      } else {
        artwork.images = [...artwork.images, ...newImages];
      }
    } else if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/artworks");
      artwork.images.push({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }

    // Direct image URL update
    if (req.body.images && typeof req.body.images === "string") {
      try {
        const parsed = JSON.parse(req.body.images);
        if (Array.isArray(parsed)) artwork.images = parsed;
      } catch {
        // Not a JSON string
      }
    }

    if (req.body.title) artwork.title = req.body.title.trim();
    if (req.body.artist) {
      artwork.artist = req.body.artist.trim();
      artwork.artistSlug = createSlug(req.body.artist);
    }
    if (req.body.category) {
      artwork.category = req.body.category.trim();
      artwork.categorySlug = createSlug(req.body.category);
    }
    if (req.body.style !== undefined) artwork.style = req.body.style;
    if (req.body.collectionName !== undefined) artwork.collectionName = req.body.collectionName;
    if (req.body.collectionSlug !== undefined) artwork.collectionSlug = req.body.collectionSlug;
    if (req.body.description !== undefined) artwork.description = req.body.description;
    if (req.body.story !== undefined) artwork.story = req.body.story;
    if (req.body.price !== undefined) artwork.price = Number(req.body.price);
    if (req.body.originalPrice !== undefined) artwork.originalPrice = Number(req.body.originalPrice);
    if (req.body.isPriceOnRequest !== undefined)
      artwork.isPriceOnRequest = req.body.isPriceOnRequest === "true" || req.body.isPriceOnRequest === true;
    if (req.body.medium !== undefined) artwork.medium = req.body.medium;
    if (req.body.material !== undefined) artwork.material = req.body.material;
    if (req.body.dimensions !== undefined) artwork.dimensions = req.body.dimensions;
    if (req.body.orientation !== undefined) artwork.orientation = req.body.orientation;
    if (req.body.size !== undefined) artwork.size = req.body.size;
    if (req.body.availability !== undefined) artwork.availability = req.body.availability;
    if (req.body.isNew !== undefined)
      artwork.isNew = req.body.isNew === "true" || req.body.isNew === true;
    if (req.body.isFeatured !== undefined)
      artwork.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;
    if (req.body.isLimitedEdition !== undefined)
      artwork.isLimitedEdition = req.body.isLimitedEdition === "true" || req.body.isLimitedEdition === true;
    if (req.body.sku !== undefined) artwork.sku = req.body.sku;

    if (req.body.specs) {
      let parsedSpecs = req.body.specs;
      if (typeof parsedSpecs === "string") {
        try {
          parsedSpecs = JSON.parse(parsedSpecs);
        } catch {
          parsedSpecs = artwork.specs;
        }
      }
      artwork.specs = { ...artwork.specs, ...parsedSpecs };
    }

    const updatedArtwork = await artwork.save();

    return res.status(200).json({
      success: true,
      message: "Artwork updated successfully",
      data: updatedArtwork,
    });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return res.status(500).json({ success: false, message: "Failed to update artwork", error: error.message });
  }
};

// @desc    Toggle or update New Arrival status
// @route   PATCH /api/artworks/:id/new-arrival
export const toggleNewArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({ success: false, message: "Artwork not found" });
    }

    artwork.isNew = req.body.isNew !== undefined ? Boolean(req.body.isNew) : !artwork.isNew;
    await artwork.save();

    return res.status(200).json({
      success: true,
      message: `Artwork marked as ${artwork.isNew ? "New Arrival" : "Standard Showcase"}`,
      data: artwork,
    });
  } catch (error) {
    console.error("Error toggling new arrival:", error);
    return res.status(500).json({ success: false, message: "Failed to update new arrival status", error: error.message });
  }
};

// @desc    Delete an artwork
// @route   DELETE /api/artworks/:id
export const deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({ success: false, message: "Artwork not found" });
    }

    // Clean up images from Cloudinary
    for (const img of artwork.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await Artwork.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Artwork deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return res.status(500).json({ success: false, message: "Failed to delete artwork", error: error.message });
  }
};

