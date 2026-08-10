import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radiusMeters: { type: Number, required: true, min: 10, max: 50000 },
  },
  { timestamps: true }
);

export default mongoose.models.Site || mongoose.model("Site", SiteSchema);
