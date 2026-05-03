import "dotenv/config";
import { getEnv } from "./config/env";
import { connectMongo } from "./db/mongoose";
import { WorkflowModel } from "./models/Workflow";
import { ExecutionModel } from "./models/Execution";
import { createRedis } from "./queue/redis";
import { createWorkflowRunsWorker, type RunJobData } from "./queue/worker";
import { topoSort } from "./services/dag";
import { placePaperOrder } from "./services/paperBroker";

type AnyNode = { id: string; type?: string; data?: any };
type AnyEdge = { source: string; target: string };

function getActionSide(actionType: string): "long" | "short" | "close" | null {
  if (actionType === "open-long") return "long";
  if (actionType === "open-short") return "short";
  if (actionType === "close-position") return "close";
  return null;
}

async function handleRun(job: RunJobData) {
  const execution = await ExecutionModel.findOne({ _id: job.executionId, userId: job.userId }).exec();
  if (!execution) return;

  execution.status = "running";
  execution.startedAt = new Date();
  execution.steps = [];
  await execution.save();

  try {
    const wf = (await WorkflowModel.findOne({ _id: job.workflowId, userId: job.userId }).lean().exec()) as any;
    if (!wf) {
      throw new Error("Workflow not found");
    }

    const nodes = (wf.nodes ?? []) as AnyNode[];
    const edges = (wf.edges ?? []) as AnyEdge[];
    const ordered = topoSort(nodes, edges);

    for (const node of ordered) {
      if (node.type === "trigger") {
        continue;
      }

      if (node.type !== "action") {
        continue;
      }

      const data = node.data ?? {};
      const actionType = String(data.actionType ?? "");
      const side = getActionSide(actionType);

      const step: any = {
        nodeId: node.id,
        nodeType: actionType || "action",
        status: "running",
        startedAt: new Date().toISOString(),
      };

      execution.steps = [...(execution.steps ?? []), step];
      await execution.save();

      if (actionType === "notify") {
        step.status = "success";
        step.finishedAt = new Date().toISOString();
        step.output = { message: "Notification simulated (paper mode)." };
        await execution.save();
        continue;
      }

      if (!side) {
        step.status = "failed";
        step.finishedAt = new Date().toISOString();
        step.error = `Unsupported actionType: ${actionType}`;
        await execution.save();
        throw new Error(step.error);
      }

      const exchange = String(data.exchange ?? "Paper");
      const asset = String(data.asset ?? "SOL");
      const quantity = Number(data.quantity ?? 0);
      const leverage = data.leverage ? Number(data.leverage) : undefined;
      const orderType = data.orderType ? String(data.orderType) : "market";

      const result = await placePaperOrder({
        exchange,
        asset,
        side,
        quantity,
        leverage,
        orderType: orderType === "limit" ? "limit" : "market",
      });

      step.status = "success";
      step.finishedAt = new Date().toISOString();
      step.output = { exchange, asset, side, orderType, ...result };
      await execution.save();
    }

    execution.status = "success";
    execution.finishedAt = new Date();
    await execution.save();
  } catch (err) {
    execution.status = "failed";
    execution.finishedAt = new Date();
    execution.error = err instanceof Error ? err.message : "Unknown error";
    await execution.save();
  }
}

async function main() {
  const env = getEnv();
  await connectMongo(env.MONGODB_URI);

  const redis = createRedis(env.REDIS_URL);
  createWorkflowRunsWorker(redis, handleRun);

  // eslint-disable-next-line no-console
  console.log("Runner started.");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

