import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ExecutionSchema = new Schema(
  {
    workflowId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "Workflow" },
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    status: { type: String, enum: ["queued", "running", "success", "failed"], required: true, index: true },
    startedAt: { type: Date },
    finishedAt: { type: Date },
    error: { type: String },
    steps: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

export type ExecutionDoc = InferSchemaType<typeof ExecutionSchema> & { _id: mongoose.Types.ObjectId };

export const ExecutionModel = mongoose.models.Execution ?? mongoose.model("Execution", ExecutionSchema);

