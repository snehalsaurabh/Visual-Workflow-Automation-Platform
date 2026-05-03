import mongoose, { Schema, type InferSchemaType } from "mongoose";

const NodeCatalogSchema = new Schema(
  {
    kind: { type: String, enum: ["trigger", "action"], required: true, index: true },
    type: { type: String, required: true, index: true },
    label: { type: String, required: true },
    description: { type: String },
    configSchema: { type: Schema.Types.Mixed, default: {} },
    credentialSchema: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

NodeCatalogSchema.index({ kind: 1, type: 1 }, { unique: true });

export type NodeCatalogDoc = InferSchemaType<typeof NodeCatalogSchema> & { _id: mongoose.Types.ObjectId };

export const NodeCatalogModel = mongoose.models.NodeCatalog ?? mongoose.model("NodeCatalog", NodeCatalogSchema);

