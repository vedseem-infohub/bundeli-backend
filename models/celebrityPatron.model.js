import mongoose from "mongoose";

const celebrityPatronSchema = new mongoose.Schema(
  {
    celebrityName: {
      type: String,
      required: [true, "Celebrity / Patron name is required"],
      trim: true,
    },
    celebrityTitle: {
      type: String,
      trim: true,
      default: "Royal Patron & Cultural Icon",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    artworkTitle: {
      type: String,
      required: [true, "Artwork title is required"],
      trim: true,
    },
    artist: {
      type: String,
      trim: true,
      default: "Bundeli Master Atelier",
    },
    medium: {
      type: String,
      trim: true,
      default: "Natural Mineral Pigments & 24K Gold Leaf on Wasli Paper",
    },
    dimensions: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      trim: true,
      default: () => new Date().getFullYear().toString(),
    },
    image: {
      type: String,
      required: [true, "Artwork / Patron showcase image URL is required"],
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    quote: {
      type: String,
      trim: true,
      default: "",
    },
    artworkSlug: {
      type: String,
      trim: true,
      default: "",
    },
    tag: {
      type: String,
      trim: true,
      default: "Bespoke Royal Acquisition",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CelebrityPatron =
  mongoose.models.CelebrityPatron ||
  mongoose.model("CelebrityPatron", celebrityPatronSchema);
export default CelebrityPatron;

