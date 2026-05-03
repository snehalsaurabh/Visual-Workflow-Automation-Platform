import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional().default("development"),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  TRIGGER_POLL_INTERVAL_MS: z.coerce.number().int().positive().optional().default(5000),
  PRICE_FEED_PROVIDER: z.enum(["coingecko"]).optional().default("coingecko"),
});

export type Env = z.infer<typeof EnvSchema>;

export function getEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid executor env:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid executor environment variables");
  }
  return parsed.data;
}

