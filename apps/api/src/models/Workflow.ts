import mongoose, { Schema, type InferSchemaType } from "mongoose";

const WorkflowSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["draft", "armed"], default: "draft", index: true },
    nodes: { type: [Schema.Types.Mixed], default: [] },
    edges: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

export type WorkflowDoc = InferSchemaType<typeof WorkflowSchema> & { _id: mongoose.Types.ObjectId };

export const WorkflowModel = mongoose.models.Workflow ?? mongoose.model("Workflow", WorkflowSchema);

