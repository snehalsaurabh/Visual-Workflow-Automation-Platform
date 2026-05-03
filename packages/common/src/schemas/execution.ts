import { z } from "zod";

export const ExecutionStatusSchema = z.enum(["queued", "running", "success", "failed"]);

export const ExecutionStepSchema = z.object({
  nodeId: z.string().min(1),
  nodeType: z.string().min(1),
  status: z.enum(["running", "success", "failed"]),
  startedAt: z.string().min(1),
  finishedAt: z.string().optional(),
  output: z.unknown().optional(),
  error: z.string().optional(),
});

export const ExecutionRecordSchema = z.object({
  _id: z.string().min(1),
  workflowId: z.string().min(1),
  userId: z.string().min(1),
  status: ExecutionStatusSchema,
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  error: z.string().optional(),
  steps: z.array(ExecutionStepSchema).optional(),
});

export type ExecutionRecord = z.infer<typeof ExecutionRecordSchema>;
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;

