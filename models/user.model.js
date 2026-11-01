import mongoose from "mongoose";

const selectedArtworkSchema = new mongoose.Schema(
  {
    artworkId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
    price: { type: Number, default: 0 },
    artist: { type: String, default: "" },
    selectedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Selected", "Inquiry Sent", "WhatsApp Commission", "In Progress", "Completed"],
      default: "Selected",
    },
    notes: { type: String, default: "" },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin", "curator"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    mobileNo: {
      type: String,
      trim: true,
      default: "",
    },
    whatsappNo: {
      type: String,
      trim: true,
      default: "",
    },
    atelierTitle: {
      type: String,
      trim: true,
      default: "Bundeli Royal Atelier Master & Senior Conservator",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "Orchha" },
      state: { type: String, trim: true, default: "Madhya Pradesh" },
      pincode: { type: String, trim: true, default: "472246" },
      country: { type: String, trim: true, default: "India" },
    },
    socialLinks: {
      instagram: { type: String, trim: true, default: "" },
      facebook: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      youtube: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      pinterest: { type: String, trim: true, default: "" },
      website: { type: String, trim: true, default: "" },
    },
    avatar: {
      type: String,
      default: "",
    },
    assistantName: {
      type: String,
    },
    assistantImage: {
      type: String,
    },
    history: [{ type: String }],
    selectedArtworks: [selectedArtworkSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
