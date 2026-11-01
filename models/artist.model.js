import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Artist slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      trim: true,
      default: "Bundelkhand, India",
    },
    region: {
      type: String,
      trim: true,
      default: "Bundelkhand",
    },
    role: {
      type: String,
      trim: true,
      default: "Master Artisan",
    },
    avatar: {
      type: String,
      required: [true, "Artist portrait is required"],
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    coverImagePublicId: {
      type: String,
      default: "",
    },
    shortBio: {
      type: String,
      trim: true,
      default: "",
    },
    biography: {
      type: String,
      trim: true,
      default: "",
    },
    journey: {
      type: String,
      trim: true,
      default: "",
    },
    style: {
      type: String,
      trim: true,
      default: "Bundelkhand Royal Traditional",
    },
    mediums: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 10,
    },
    artworkCount: {
      type: Number,
      default: 0,
    },
    awards: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Artist = mongoose.models.Artist || mongoose.model("Artist", artistSchema);

export default Artist;

