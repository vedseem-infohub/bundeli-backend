import Review from "../models/review.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// @desc    Get all reviews
// @route   GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    const { rating, approvedOnly } = req.query;
    const filter = {};

    if (approvedOnly === "true") {
      filter.isApproved = true;
    }
    if (rating) {
      filter.rating = Number(rating);
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
  }
};

// @desc    Add / Drop a new patron review (with optional Cloudinary photo upload)
// @route   POST /api/reviews
export const addReview = async (req, res) => {
  try {
    const { name, location, role, rating, comment, artworkTitle, verified, isApproved, date } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Patron name is required." });
    }
    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "A short review comment of at least 5 characters is required.",
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5 stars.",
      });
    }

    let imageUrl = req.body.image || "";
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/reviews");
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const newReview = await Review.create({
      name: name.trim(),
      location: location ? location.trim() : "India",
      role: role ? role.trim() : "Verified Collector",
      rating: numRating,
      comment: comment.trim(),
      artworkTitle: artworkTitle ? artworkTitle.trim() : "Bundeli Kalavrat Commission",
      image: imageUrl,
      imagePublicId,
      verified: verified !== undefined ? Boolean(verified) : true,
      isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      date:
        date ||
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
    });

    return res.status(201).json({
      success: true,
      message: "Patron review published successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ success: false, message: "Failed to add review", error: error.message });
  }
};

// @desc    Edit / Update a patron review
// @route   PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (req.file) {
      if (review.imagePublicId) {
        await deleteFromCloudinary(review.imagePublicId);
      }
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "bundeli/reviews");
      review.image = uploadResult.secure_url;
      review.imagePublicId = uploadResult.public_id;
    } else if (req.body.image) {
      review.image = req.body.image;
    }

    if (req.body.name) review.name = req.body.name.trim();
    if (req.body.location !== undefined) review.location = req.body.location;
    if (req.body.role !== undefined) review.role = req.body.role;
    if (req.body.rating !== undefined) review.rating = Number(req.body.rating);
    if (req.body.comment !== undefined) review.comment = req.body.comment.trim();
    if (req.body.artworkTitle !== undefined) review.artworkTitle = req.body.artworkTitle;
    if (req.body.verified !== undefined) review.verified = Boolean(req.body.verified);
    if (req.body.isApproved !== undefined) review.isApproved = Boolean(req.body.isApproved);
    if (req.body.date !== undefined) review.date = req.body.date;

    const updated = await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ success: false, message: "Failed to update review", error: error.message });
  }
};

// @desc    Delete a patron review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.imagePublicId) {
      await deleteFromCloudinary(review.imagePublicId);
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ success: false, message: "Failed to delete review", error: error.message });
  }
};

