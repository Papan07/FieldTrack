import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    traineeId: { type: String, required: true },
    traineeName: { type: String, required: true },
    traineeBatch: { type: String, default: "" },
    siteId: { type: String, required: true },
    siteName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: 0 },
    distanceMeters: { type: Number, required: true },
    status: { type: String, enum: ["present", "rejected"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
