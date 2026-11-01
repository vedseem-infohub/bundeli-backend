import express from "express";
import {
  getCategories,
  getCategoryByIdOrSlug,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { uploadSingle } from "../middlewares/upload.js";

const categoryRouter = express.Router();

// Public routes
categoryRouter.get("/", getCategories);
categoryRouter.get("/:idOrSlug", getCategoryByIdOrSlug);

// Management routes with Multer image upload
categoryRouter.post("/", uploadSingle("image"), addCategory);
categoryRouter.put("/:id", uploadSingle("image"), updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;

