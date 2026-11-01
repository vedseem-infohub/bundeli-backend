import express from "express";
import {
  getCelebrityPaintings,
  getCelebrityPaintingById,
  addCelebrityPainting,
  updateCelebrityPainting,
  deleteCelebrityPainting,
} from "../controllers/celebrityPatron.controller.js";
import { uploadSingle } from "../middlewares/upload.js";

const celebrityPatronRouter = express.Router();

// Public routes
celebrityPatronRouter.get("/", getCelebrityPaintings);
celebrityPatronRouter.get("/:id", getCelebrityPaintingById);

// Management routes with Multer image upload
celebrityPatronRouter.post("/", uploadSingle("image"), addCelebrityPainting);
celebrityPatronRouter.put("/:id", uploadSingle("image"), updateCelebrityPainting);
celebrityPatronRouter.delete("/:id", deleteCelebrityPainting);

export default celebrityPatronRouter;

