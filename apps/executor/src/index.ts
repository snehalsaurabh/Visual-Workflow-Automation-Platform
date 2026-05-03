import "dotenv/config";
import { getEnv } from "./config/env";
import { connectMongo } from "./db/mongoose";
import { WorkflowModel } from "./models/Workflow";
import { ExecutionModel } from "./models/Execution";
import { createRedis, createWorkflowRunsQueue } from "./queue/queues";
import { getUsdPrice } from "./services/priceFeed";
import { evalPriceTrigger, evalTimerTrigger } from "./services/triggerEval";

type AnyNode = { id: string; type?: string; data?: any };

function findTrigger(nodes: AnyNode[]) {
  return nodes.find((n) => n.type === "trigger") ?? null;
}

async function main() {
  const env = getEnv();
  await connectMongo(env.MONGODB_URI);

  const redis = createRedis(env.REDIS_URL);
  const workflowRunsQueue = createWorkflowRunsQueue(redis);

  // eslint-disable-next-line no-console
  console.log("Executor started.");

  // Simple poller loop for v1.
  // Later: add per-workflow cron scheduling, dedupe, jitter, and leader election.
  for (;;) {
    const armed = await WorkflowModel.find({ status: "armed" }).lean().exec();

    for (const wf of armed) {
      const nodes = (wf.nodes ?? []) as AnyNode[];
      const trigger = findTrigger(nodes);
      if (!trigger) continue;

      const triggerData = trigger.data ?? {};
      const userId = String(wf.userId);
      const workflowId = String(wf._id);

      let shouldRun = false;
      let reason = "unknown";

      if (triggerData.triggerType === "timer") {
        const lastSuccess = (await ExecutionModel.findOne({ workflowId, userId, status: "success" })
          .sort({ finishedAt: -1 })
          .lean()
          .exec()) as any;
        const lastSuccessAtMs = lastSuccess?.finishedAt ? new Date(lastSuccess.finishedAt).getTime() : null;
        const intervalMinutes = Number(triggerData.intervalMinutes ?? 5);
        const evalResult = evalTimerTrigger({ lastSuccessAtMs, intervalMinutes });
        shouldRun = evalResult.shouldRun;
        reason = evalResult.reason;
      } else if (triggerData.triggerType === "price") {
        const asset = String(triggerData.asset ?? "SOL");
        const operator = (triggerData.operator ?? "below") as "below" | "above";
        const threshold = Number(triggerData.price ?? 150);
        const current = await getUsdPrice(env.PRICE_FEED_PROVIDER, asset);
        const evalResult = evalPriceTrigger({ operator, threshold, current });
        shouldRun = evalResult.shouldRun;
        reason = evalResult.reason;
      } else {
        continue;
      }

      if (!shouldRun) continue;

      const execution = await ExecutionModel.create({
        workflowId,
        userId,
        status: "queued",
      });

      await workflowRunsQueue.add(
        "runWorkflow",
        { workflowId, userId, executionId: String(execution._id), reason },
        {
          attempts: 5,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: 200,
          removeOnFail: 500,
        },
      );
    }

    await new Promise((r) => setTimeout(r, env.TRIGGER_POLL_INTERVAL_MS));
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

