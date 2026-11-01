import express from "express";
import {
  getAllNews,
  getNewsByIdOrSlug,
  addNews,
  updateNews,
  deleteNews,
} from "../controllers/news.controller.js";
import { uploadNewsMedia } from "../middlewares/upload.js";

const newsRouter = express.Router();

// Public routes
newsRouter.get("/", getAllNews);
newsRouter.get("/:idOrSlug", getNewsByIdOrSlug);

// Management routes with Multer image & video media upload
newsRouter.post("/", uploadNewsMedia, addNews);
newsRouter.put("/:id", uploadNewsMedia, updateNews);
newsRouter.delete("/:id", deleteNews);

export default newsRouter;

