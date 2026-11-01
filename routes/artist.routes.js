import express from "express";
import {
  getArtists,
  getArtistBySlug,
  addArtist,
  updateArtist,
  deleteArtist,
} from "../controllers/artist.controller.js";
import { uploadArtistMedia } from "../middlewares/upload.js";

const artistRouter = express.Router();

// Public discovery routes
artistRouter.get("/", getArtists);
artistRouter.get("/:slugOrId", getArtistBySlug);

// Atelier Administration routes (supports avatar and cover image uploads)
artistRouter.post("/", uploadArtistMedia, addArtist);
artistRouter.put("/:id", uploadArtistMedia, updateArtist);
artistRouter.delete("/:id", deleteArtist);

export default artistRouter;

