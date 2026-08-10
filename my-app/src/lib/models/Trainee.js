import mongoose from "mongoose";

const TraineeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    batch: { type: String, default: "" },
    traineeId: { type: String, default: "" },
    role: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Trainee || mongoose.model("Trainee", TraineeSchema);
