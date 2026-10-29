import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    role: {
      type: String,
      enum: ["engineer", "supervisor", "mason", "electrician", "plumber", "labour", "accountant", "other"],
      default: "labour",
    },
    dailyWage: { type: Number, required: true, min: 0 },
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    assignedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model("Employee", employeeSchema);