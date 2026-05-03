import mongoose, { Schema } from "mongoose";

const ExecutionSchema = new Schema(
  {
    workflowId: { type: Schema.Types.ObjectId, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    status: { type: String, enum: ["queued", "running", "success", "failed"], required: true, index: true },
    startedAt: { type: Date },
    finishedAt: { type: Date },
    error: { type: String },
    steps: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

export const ExecutionModel = mongoose.models.Execution ?? mongoose.model("Execution", ExecutionSchema);

