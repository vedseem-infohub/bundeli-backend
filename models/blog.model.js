import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      trim: true,
      default: "Heritage & History",
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
      default: "6 min read",
    },
    author: {
      type: String,
      trim: true,
      default: "Bundeli Kalavrat Curatorial Guild",
    },
    authorRole: {
      type: String,
      trim: true,
      default: "Senior Curator & Art Historian",
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
    coverImagePublicId: {
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
    relatedArtworks: [
      {
        type: String,
      },
    ],
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;

