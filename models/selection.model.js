import mongoose from "mongoose";

const selectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userName: {
      type: String,
      trim: true,
      default: "Patron Collector",
    },
    userEmail: {
      type: String,
      trim: true,
      default: "",
    },
    userPhone: {
      type: String,
      trim: true,
      default: "",
    },
    artworkId: {
      type: String,
      required: true,
    },
    artworkTitle: {
      type: String,
      required: true,
    },
    artworkSlug: {
      type: String,
      default: "",
    },
    artworkImage: {
      type: String,
      default: "",
    },
    artist: {
      type: String,
      default: "Bundeli Master Atelier",
    },
    category: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Selected", "Inquiry Sent", "WhatsApp Commission", "In Progress", "Completed"],
      default: "Selected",
    },
    channel: {
      type: String,
      enum: ["Direct Selection", "WhatsApp", "Enquiry Modal", "Quick View"],
      default: "Direct Selection",
    },
    customDimensions: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

selectionSchema.index({ createdAt: -1 });
selectionSchema.index({ user: 1 });
selectionSchema.index({ artworkId: 1 });

const Selection =
  mongoose.models.Selection || mongoose.model("Selection", selectionSchema);
export default Selection;

