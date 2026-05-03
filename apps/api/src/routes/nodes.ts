import { Router } from "express";
import { NodeDefinitionSchema } from "@tradeflow/common";
import { NodeCatalogModel } from "../models/NodeCatalog";

export const nodesRouter = Router();

nodesRouter.get("/", async (_req, res) => {
  const nodes = await NodeCatalogModel.find({}).sort({ kind: 1, type: 1 }).lean().exec();
  return res.json(nodes);
});

nodesRouter.post("/seed", async (_req, res) => {
  const seeds = [
    {
      kind: "trigger",
      type: "timer",
      label: "Timer Trigger",
      description: "Execute workflow every N minutes.",
      configSchema: { intervalMinutes: { type: "string", default: "5" } },
    },
    {
      kind: "trigger",
      type: "price",
      label: "Price Trigger",
      description: "Execute when asset crosses a threshold.",
      configSchema: { asset: { type: "string", default: "SOL" }, operator: { enum: ["below", "above"] }, price: { type: "string", default: "150" } },
    },
    { kind: "action", type: "open-long", label: "Open Long", description: "Paper buy/long order." },
    { kind: "action", type: "open-short", label: "Open Short", description: "Paper sell/short order." },
    { kind: "action", type: "close-position", label: "Close Position", description: "Paper close." },
    { kind: "action", type: "notify", label: "Notify Desk", description: "Send a notification stub." },
  ];

  for (const seed of seeds) {
    const parsed = NodeDefinitionSchema.safeParse(seed);
    if (!parsed.success) {
      return res.status(500).json({ error: parsed.error.flatten(), seed });
    }
    await NodeCatalogModel.updateOne(
      { kind: seed.kind, type: seed.type },
      { $set: { ...seed, credentialSchema: {} } },
      { upsert: true },
    ).exec();
  }

  return res.json({ ok: true });
});

