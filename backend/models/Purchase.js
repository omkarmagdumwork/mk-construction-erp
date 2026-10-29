import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    supplierName: { type: String, required: true, trim: true },
    supplierPhone: { type: String, trim: true, default: "" },
    quantity: { type: Number, required: true, min: 0.01 },
    rate: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    purchaseDate: { type: Date, default: Date.now },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);