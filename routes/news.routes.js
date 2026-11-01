import express from "express";
import {
  getAllNews,
  getNewsByIdOrSlug,
  addNews,
  updateNews,
  deleteNews,
} from "../controllers/news.controller.js";
import { uploadSingle } from "../middlewares/upload.js";

const newsRouter = express.Router();

// Public routes
newsRouter.get("/", getAllNews);
newsRouter.get("/:idOrSlug", getNewsByIdOrSlug);

// Management routes with Multer image upload
newsRouter.post("/", uploadSingle("image"), addNews);
newsRouter.put("/:id", uploadSingle("image"), updateNews);
newsRouter.delete("/:id", deleteNews);

export default newsRouter;

