import express from "express";
import {
  getNewArrivals,
  addArtwork,
  updateArtwork,
  deleteArtwork,
  toggleNewArrival,
} from "../controllers/artwork.controller.js";
import { uploadMultiple } from "../middlewares/upload.js";

const newArrivalsRouter = express.Router();

// Middleware to automatically force isNew: true on new arrivals route
const forceNewArrival = (req, res, next) => {
  req.body.isNew = true;
  next();
};

// GET all new arrivals
newArrivalsRouter.get("/", getNewArrivals);

// POST add new arrival
newArrivalsRouter.post("/", uploadMultiple("images", 10), forceNewArrival, addArtwork);

// PUT edit new arrival
newArrivalsRouter.put("/:id", uploadMultiple("images", 10), updateArtwork);

// PATCH toggle status
newArrivalsRouter.patch("/:id/toggle", toggleNewArrival);

// DELETE remove
newArrivalsRouter.delete("/:id", deleteArtwork);

export default newArrivalsRouter;

