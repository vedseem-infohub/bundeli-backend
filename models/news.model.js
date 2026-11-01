import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "News slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    badge: {
      type: String,
      trim: true,
      default: "PRESS & DISPATCH",
    },
    outlet: {
      type: String,
      trim: true,
      default: "Bundeli Kalavrat Press",
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
    readTime: {
      type: String,
      trim: true,
      default: "4 min read",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    videoPublicId: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      default: "",
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
  },
  {
    timestamps: true,
  }
);

const News = mongoose.models.News || mongoose.model("News", newsSchema);
export default News;

