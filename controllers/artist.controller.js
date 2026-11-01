import Artist from "../models/artist.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";

// Helper to sanitize slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Helper to parse arrays from formData (handles JSON string, comma-separated string, or array)
const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Comma-separated fallback
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// @desc    Get all artists (with optional filters: search, region, featured)
// @route   GET /api/artists
export const getArtists = async (req, res) => {
  try {
    const { region, featured, search } = req.query;
    const filter = {};

    if (region && region !== "all") {
      filter.region = region;
    }

    if (featured !== undefined && featured !== "") {
      filter.featured = featured === "true" || featured === true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { style: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const artists = await Artist.find(filter).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: artists.length,
      data: artists,
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch artists",
      error: error.message,
    });
  }
};

// @desc    Get single artist by slug or ID
// @route   GET /api/artists/:slugOrId
export const getArtistBySlug = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    let artist = null;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      artist = await Artist.findById(slugOrId);
    }

    if (!artist) {
      artist = await Artist.findOne({ slug: slugOrId.toLowerCase() });
    }

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (error) {
    console.error("Error fetching artist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist details",
      error: error.message,
    });
  }
};

// @desc    Add a new master artist (with portrait & cover image upload)
// @route   POST /api/artists
export const addArtist = async (req, res) => {
  try {
    const {
      name,
      slug: customSlug,
      location,
      region,
      role,
      shortBio,
      biography,
      journey,
      style,
      mediums,
      experienceYears,
      artworkCount,
      awards,
      featured,
      order,
      isActive,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Artist name is required.",
      });
    }

    // Determine slug
    let finalSlug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    if (!finalSlug) finalSlug = `artist-${Date.now()}`;

    // Ensure slug uniqueness
    const existingSlug = await Artist.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Handle portrait avatar upload or direct URL
    let avatarUrl = req.body.avatar || req.body.image;
    let avatarPublicId = "";

    const avatarFile = req.files?.avatar?.[0] || req.files?.image?.[0];
    if (avatarFile) {
      const uploadResult = await uploadBufferToCloudinary(avatarFile.buffer, "bundeli/artists/portraits");
      avatarUrl = uploadResult.secure_url;
      avatarPublicId = uploadResult.public_id;
    }

    // Handle studio / collection cover image
    let coverImageUrl = req.body.coverImage || "";
    let coverImagePublicId = "";

    const coverFile = req.files?.coverImage?.[0];
    if (coverFile) {
      const uploadResult = await uploadBufferToCloudinary(coverFile.buffer, "bundeli/artists/covers");
      coverImageUrl = uploadResult.secure_url;
      coverImagePublicId = uploadResult.public_id;
    }

    if (!avatarUrl) {
      avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";
    }

    const newArtist = await Artist.create({
      name: name.trim(),
      slug: finalSlug,
      location: location || "Bundelkhand, India",
      region: region || "Bundelkhand",
      role: role || "Master Artisan",
      avatar: avatarUrl,
      avatarPublicId,
      coverImage: coverImageUrl || avatarUrl,
      coverImagePublicId,
      shortBio: shortBio || "",
      biography: biography || "",
      journey: journey || "",
      style: style || "Bundelkhand Royal Traditional",
      mediums: parseArrayField(mediums),
      experienceYears: experienceYears ? Number(experienceYears) : 10,
      artworkCount: artworkCount ? Number(artworkCount) : 0,
      awards: parseArrayField(awards),
      featured: featured === true || featured === "true",
      order: order ? Number(order) : 0,
      isActive: isActive !== false && isActive !== "false",
    });

    return res.status(201).json({
      success: true,
      message: "Artist profile created successfully",
      data: newArtist,
    });
  } catch (error) {
    console.error("Error creating artist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create artist profile",
      error: error.message,
    });
  }
};

// @desc    Update an existing artist profile
// @route   PUT /api/artists/:id
export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    const {
      name,
      slug: newSlug,
      location,
      region,
      role,
      shortBio,
      biography,
      journey,
      style,
      mediums,
      experienceYears,
      artworkCount,
      awards,
      featured,
      order,
      isActive,
      avatar,
      coverImage,
    } = req.body;

    if (name) artist.name = name.trim();

    if (newSlug && generateSlug(newSlug) !== artist.slug) {
      let slugCandidate = generateSlug(newSlug);
      const conflict = await Artist.findOne({ slug: slugCandidate, _id: { $ne: id } });
      if (conflict) {
        slugCandidate = `${slugCandidate}-${Date.now().toString().slice(-4)}`;
      }
      artist.slug = slugCandidate;
    }

    if (location !== undefined) artist.location = location;
    if (region !== undefined) artist.region = region;
    if (role !== undefined) artist.role = role;
    if (shortBio !== undefined) artist.shortBio = shortBio;
    if (biography !== undefined) artist.biography = biography;
    if (journey !== undefined) artist.journey = journey;
    if (style !== undefined) artist.style = style;
    if (experienceYears !== undefined) artist.experienceYears = Number(experienceYears);
    if (artworkCount !== undefined) artist.artworkCount = Number(artworkCount);
    if (featured !== undefined) artist.featured = featured === true || featured === "true";
    if (order !== undefined) artist.order = Number(order);
    if (isActive !== undefined) artist.isActive = isActive === true || isActive === "true";

    if (mediums !== undefined) artist.mediums = parseArrayField(mediums);
    if (awards !== undefined) artist.awards = parseArrayField(awards);

    // Check for newly uploaded avatar
    const avatarFile = req.files?.avatar?.[0] || req.files?.image?.[0];
    if (avatarFile) {
      if (artist.avatarPublicId) {
        await deleteFromCloudinary(artist.avatarPublicId).catch(() => {});
      }
      const uploadResult = await uploadBufferToCloudinary(avatarFile.buffer, "bundeli/artists/portraits");
      artist.avatar = uploadResult.secure_url;
      artist.avatarPublicId = uploadResult.public_id;
    } else if (avatar && typeof avatar === "string" && avatar !== artist.avatar) {
      artist.avatar = avatar;
    }

    // Check for newly uploaded cover image
    const coverFile = req.files?.coverImage?.[0];
    if (coverFile) {
      if (artist.coverImagePublicId) {
        await deleteFromCloudinary(artist.coverImagePublicId).catch(() => {});
      }
      const uploadResult = await uploadBufferToCloudinary(coverFile.buffer, "bundeli/artists/covers");
      artist.coverImage = uploadResult.secure_url;
      artist.coverImagePublicId = uploadResult.public_id;
    } else if (coverImage && typeof coverImage === "string" && coverImage !== artist.coverImage) {
      artist.coverImage = coverImage;
    }

    await artist.save();

    return res.status(200).json({
      success: true,
      message: "Artist profile updated successfully",
      data: artist,
    });
  } catch (error) {
    console.error("Error updating artist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update artist profile",
      error: error.message,
    });
  }
};

// @desc    Delete an artist profile
// @route   DELETE /api/artists/:id
export const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    // Clean up Cloudinary assets
    if (artist.avatarPublicId) {
      await deleteFromCloudinary(artist.avatarPublicId).catch(() => {});
    }
    if (artist.coverImagePublicId) {
      await deleteFromCloudinary(artist.coverImagePublicId).catch(() => {});
    }

    await Artist.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Artist "${artist.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete artist profile",
      error: error.message,
    });
  }
};

