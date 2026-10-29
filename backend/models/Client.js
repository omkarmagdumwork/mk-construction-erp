import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    company: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Client || mongoose.model("Client", clientSchema);