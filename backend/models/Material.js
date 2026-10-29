import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    unit: {
      type: String,
      enum: ["bag", "kg", "ton", "piece", "cubic-meter", "liter", "brass"],
      required: true,
    },
    stockQuantity: { type: Number, default: 0, min: 0 },
    minStockLevel: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Material || mongoose.model("Material", materialSchema);