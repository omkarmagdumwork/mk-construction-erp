import mongoose from "mongoose";

const materialUsageSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    usedOn: { type: Date, default: Date.now },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.MaterialUsage ||
  mongoose.model("MaterialUsage", materialUsageSchema);