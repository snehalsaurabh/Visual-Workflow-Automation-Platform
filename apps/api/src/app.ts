import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes/auth";
import { workflowsRouter } from "./routes/workflows";
import { nodesRouter } from "./routes/nodes";
import { executionsRouter } from "./routes/executions";
import { getEnv } from "./config/env";

export function createApp() {
  const env = getEnv();
  const app = express();

  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/workflows", workflowsRouter);
  app.use("/api/nodes", nodesRouter);
  app.use("/api/executions", executionsRouter);

  return app;
}

