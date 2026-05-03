import { Worker } from "bullmq";
import type Redis from "ioredis";

export type RunJobData = {
  workflowId: string;
  userId: string;
  executionId: string;
  reason?: string;
};

export function createWorkflowRunsWorker(
  redis: Redis,
  handler: (data: RunJobData) => Promise<void>,
) {
  return new Worker(
    "workflowRuns",
    async (job) => {
      await handler(job.data as RunJobData);
    },
    { connection: redis, concurrency: 2 },
  );
}

