import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
       client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    location: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["planning", "in-progress", "on-hold", "completed"],
      default: "planning",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);