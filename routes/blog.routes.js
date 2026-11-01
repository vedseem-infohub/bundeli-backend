import express from "express";
import {
  getBlogs,
  getBlogByIdOrSlug,
  addBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { uploadSingle } from "../middlewares/upload.js";

const blogRouter = express.Router();

// Public routes
blogRouter.get("/", getBlogs);
blogRouter.get("/:idOrSlug", getBlogByIdOrSlug);

// Management routes with Multer image upload
blogRouter.post("/", uploadSingle("coverImage"), addBlog);
blogRouter.put("/:id", uploadSingle("coverImage"), updateBlog);
blogRouter.delete("/:id", deleteBlog);

export default blogRouter;

