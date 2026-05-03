import "dotenv/config";
import { createApp } from "./app";
import { connectMongo } from "./db/mongoose";
import { getEnv } from "./config/env";

async function main() {
  const env = getEnv();
  await connectMongo(env.MONGODB_URI);

  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

