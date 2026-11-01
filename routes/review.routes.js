import express from "express";
import {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { uploadSingle } from "../middlewares/upload.js";

const reviewRouter = express.Router();

// Public routes (anyone can fetch reviews and drop a new review)
reviewRouter.get("/", getReviews);
reviewRouter.post("/", uploadSingle("image"), addReview);

// Management routes
reviewRouter.put("/:id", uploadSingle("image"), updateReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;

