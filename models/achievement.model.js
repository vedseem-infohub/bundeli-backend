import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["stat", "milestone"],
      default: "milestone",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    number: {
      type: String,
      trim: true,
      default: "",
    },
    label: {
      type: String,
      trim: true,
      default: "",
    },
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    detail: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      trim: true,
      default: "Award",
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
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
  {
    timestamps: true,
  }
);

const Achievement =
  mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema);
export default Achievement;

