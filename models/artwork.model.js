import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Artwork title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Artwork slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    artist: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },
    artistSlug: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    categorySlug: {
      type: String,
      trim: true,
      default: "",
    },
    style: {
      type: String,
      trim: true,
      default: "Bundelkhand Royal Traditional",
    },
    collectionName: {
      type: String,
      trim: true,
      default: "The Bundelkhand Heritage Collection",
    },
    collectionSlug: {
      type: String,
      trim: true,
      default: "bundelkhand-heritage",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    story: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    isPriceOnRequest: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    medium: {
      type: String,
      trim: true,
      default: "Natural Mineral Pigments & Gold Leaf",
    },
    material: {
      type: String,
      trim: true,
      default: "Handmade Sanganeri Wasli Paper",
    },
    dimensions: {
      type: String,
      trim: true,
      default: '36" x 48"',
    },
    orientation: {
      type: String,
      enum: ["Landscape", "Portrait", "Square", "Panoramic", "Round"],
      default: "Landscape",
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large", "Monumental"],
      default: "Medium",
    },
    availability: {
      type: String,
      enum: ["In Stock", "Made to Order", "Showcase Only", "Sold"],
      default: "In Stock",
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isLimitedEdition: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      trim: true,
      default: "",
    },
    specs: {
      framed: { type: String, default: "Museum-grade Teakwood Frame" },
      certificate: { type: String, default: "Authenticated Physical Dossier" },
      signature: { type: String, default: "Hand-signed on reverse by Master Artisan" },
      year: { type: String, default: () => new Date().getFullYear().toString() },
      weight: { type: String, default: "4.5 kg" },
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Helpful indexes
artworkSchema.index({ categorySlug: 1 });
artworkSchema.index({ isNew: 1 });
artworkSchema.index({ isFeatured: 1 });

const Artwork = mongoose.models.Artwork || mongoose.model("Artwork", artworkSchema);
export default Artwork;
