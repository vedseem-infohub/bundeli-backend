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
      required: [true, "News cover image URL is required"],
    },
    imagePublicId: {
      type: String,
      default: "",
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

