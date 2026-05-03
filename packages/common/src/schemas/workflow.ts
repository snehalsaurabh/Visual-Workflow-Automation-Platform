import { z } from "zod";

export const WorkflowStatusSchema = z.enum(["draft", "armed"]);

export const ReactFlowNodeSchema = z
  .object({
    id: z.string().min(1),
    type: z.string().min(1).optional(),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.unknown().optional(),
  })
  .passthrough();

export const ReactFlowEdgeSchema = z
  .object({
    id: z.string().min(1),
    source: z.string().min(1),
    target: z.string().min(1),
  })
  .passthrough();

export const WorkflowGraphSchema = z.object({
  nodes: z.array(ReactFlowNodeSchema),
  edges: z.array(ReactFlowEdgeSchema),
});

export const WorkflowCreateInputSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(""),
  status: WorkflowStatusSchema.optional().default("draft"),
  nodes: z.array(ReactFlowNodeSchema).default([]),
  edges: z.array(ReactFlowEdgeSchema).default([]),
});

export const WorkflowUpdateInputSchema = WorkflowCreateInputSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  "At least one field must be provided",
);

export type WorkflowCreateInput = z.infer<typeof WorkflowCreateInputSchema>;
export type WorkflowUpdateInput = z.infer<typeof WorkflowUpdateInputSchema>;

export const WorkflowRecordSchema = WorkflowCreateInputSchema.extend({
  _id: z.string().min(1),
  userId: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type WorkflowRecord = z.infer<typeof WorkflowRecordSchema>;

