import { z } from "zod";

export const NodeKindSchema = z.enum(["trigger", "action"]);

export const NodeDefinitionSchema = z.object({
  kind: NodeKindSchema,
  type: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  configSchema: z.record(z.string(), z.unknown()).optional().default({}),
  credentialSchema: z.record(z.string(), z.unknown()).optional().default({}),
});

export type NodeDefinition = z.infer<typeof NodeDefinitionSchema>;

