import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    serviceType: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
    adminNote: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);