import express from "express";
import {
  getArtworks,
  getNewArrivals,
  getArtworkByIdOrSlug,
  addArtwork,
  updateArtwork,
  toggleNewArrival,
  deleteArtwork,
} from "../controllers/artwork.controller.js";
import { uploadMultiple } from "../middlewares/upload.js";

const artworkRouter = express.Router();

// Public routes
artworkRouter.get("/", getArtworks);
artworkRouter.get("/new-arrivals", getNewArrivals);
artworkRouter.get("/:idOrSlug", getArtworkByIdOrSlug);

// Management routes with Multer multiple images upload
artworkRouter.post("/", uploadMultiple("images", 10), addArtwork);
artworkRouter.put("/:id", uploadMultiple("images", 10), updateArtwork);
artworkRouter.patch("/:id/new-arrival", toggleNewArrival);
artworkRouter.delete("/:id", deleteArtwork);

export default artworkRouter;

