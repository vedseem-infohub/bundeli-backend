import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: [true, "Banner image URL is required"],
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    alt: {
      type: String,
      trim: true,
      default: "Bundeli Kalavrat Hero Banner",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;

