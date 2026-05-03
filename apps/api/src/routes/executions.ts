import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { ExecutionModel } from "../models/Execution";

export const executionsRouter = Router();

executionsRouter.use(authRequired);

executionsRouter.get("/", async (req, res) => {
  const workflowId = req.query.workflowId ? String(req.query.workflowId) : undefined;

  const query: Record<string, unknown> = { userId: req.userId };
  if (workflowId) {
    query.workflowId = workflowId;
  }

  const executions = await ExecutionModel.find(query).sort({ createdAt: -1 }).limit(200).lean().exec();

  return res.json(
    executions.map((e: any) => ({
      _id: String(e._id),
      workflowId: String(e.workflowId),
      userId: String(e.userId),
      status: e.status,
      startedAt: e.startedAt?.toISOString?.() ?? undefined,
      finishedAt: e.finishedAt?.toISOString?.() ?? undefined,
      error: e.error,
      steps: e.steps ?? [],
      createdAt: e.createdAt?.toISOString?.() ?? undefined,
    })),
  );
});

