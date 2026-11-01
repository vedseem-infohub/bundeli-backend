import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patron name is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "India",
    },
    role: {
      type: String,
      trim: true,
      default: "Verified Collector",
    },
    rating: {
      type: Number,
      required: [true, "Rating out of 5 stars is required"],
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
    },
    artworkTitle: {
      type: String,
      trim: true,
      default: "Bundeli Kalavrat Commission",
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
      trim: true,
      default: () =>
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;

