import { Queue } from "bullmq";
import Redis from "ioredis";

export function createRedis(redisUrl: string) {
  return new Redis(redisUrl, { maxRetriesPerRequest: null });
}

export function createWorkflowRunsQueue(redis: Redis) {
  return new Queue("workflowRuns", { connection: redis });
}

