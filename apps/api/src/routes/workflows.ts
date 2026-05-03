import { Router } from "express";
import { WorkflowCreateInputSchema, WorkflowUpdateInputSchema } from "@tradeflow/common";
import { authRequired } from "../middleware/auth";
import { WorkflowModel } from "../models/Workflow";

export const workflowsRouter = Router();

workflowsRouter.use(authRequired);

workflowsRouter.get("/", async (req, res) => {
  const workflows = await WorkflowModel.find({ userId: req.userId })
    .sort({ updatedAt: -1 })
    .lean()
    .exec();

  const response = workflows.map((w: any) => ({
    _id: String(w._id),
    name: w.name,
    description: w.description,
    status: w.status,
    nodeCount: Array.isArray(w.nodes) ? w.nodes.length : 0,
    edgeCount: Array.isArray(w.edges) ? w.edges.length : 0,
    updatedAt: w.updatedAt,
    createdAt: w.createdAt,
  }));

  return res.json(response);
});

workflowsRouter.get("/:id", async (req, res) => {
  const workflow = (await WorkflowModel.findOne({ _id: req.params.id, userId: req.userId }).lean().exec()) as any;
  if (!workflow) {
    return res.status(404).json({ error: "Workflow not found" });
  }

  return res.json({
    _id: String(workflow._id),
    userId: String(workflow.userId),
    name: workflow.name,
    description: workflow.description,
    status: workflow.status,
    nodes: workflow.nodes ?? [],
    edges: workflow.edges ?? [],
    createdAt: workflow.createdAt?.toISOString?.() ?? String(workflow.createdAt),
    updatedAt: workflow.updatedAt?.toISOString?.() ?? String(workflow.updatedAt),
  });
});

workflowsRouter.post("/", async (req, res) => {
  const parsed = WorkflowCreateInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const created = await WorkflowModel.create({ ...parsed.data, userId: req.userId });
  return res.status(201).json({ _id: String(created._id) });
});

workflowsRouter.put("/:id", async (req, res) => {
  const parsed = WorkflowUpdateInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const updated = await WorkflowModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $set: parsed.data },
    { new: true },
  ).exec();

  if (!updated) {
    return res.status(404).json({ error: "Workflow not found" });
  }

  return res.json({ ok: true });
});

workflowsRouter.delete("/:id", async (req, res) => {
  const deleted = await WorkflowModel.findOneAndDelete({ _id: req.params.id, userId: req.userId }).exec();
  if (!deleted) {
    return res.status(404).json({ error: "Workflow not found" });
  }
  return res.json({ ok: true });
});

