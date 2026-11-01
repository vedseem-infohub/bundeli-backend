import express from "express";
import {
  getBanners,
  getActiveBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";
import { uploadSingle } from "../middlewares/upload.js";
import isAuth from "../middlewares/isAuth.js";

const bannerRouter = express.Router();

// Public routes
bannerRouter.get("/", getBanners);
bannerRouter.get("/active", getActiveBanners);

// Management routes with Multer single image upload
bannerRouter.post("/", uploadSingle("image"), addBanner);
bannerRouter.put("/:id", uploadSingle("image"), updateBanner);
bannerRouter.delete("/:id", deleteBanner);

export default bannerRouter;

