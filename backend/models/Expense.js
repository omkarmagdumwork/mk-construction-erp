import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["labour", "transport", "equipment", "food", "site-office", "other"],
      default: "other",
    },
    amount: { type: Number, required: true, min: 0 },
    expenseDate: { type: Date, default: Date.now },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model("Expense", expenseSchema);