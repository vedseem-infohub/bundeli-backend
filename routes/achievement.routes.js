import express from "express";
import {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievement.controller.js";
import { uploadSingle } from "../middlewares/upload.js";

const achievementRouter = express.Router();

// Public routes
achievementRouter.get("/", getAchievements);

// Management routes with Multer image upload
achievementRouter.post("/", uploadSingle("image"), addAchievement);
achievementRouter.put("/:id", uploadSingle("image"), updateAchievement);
achievementRouter.delete("/:id", deleteAchievement);

export default achievementRouter;

