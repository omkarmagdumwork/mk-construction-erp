import mongoose from "mongoose";

const websiteProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["residential", "commercial", "industrial", "renovation", "infrastructure"],
      required: true,
    },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["completed", "ongoing"], default: "completed" },
    completedYear: { type: Number },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.WebsiteProject ||
  mongoose.model("WebsiteProject", websiteProjectSchema);
  