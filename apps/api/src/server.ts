import { createApp } from "./app.js";
import { readApiConfig } from "./config.js";

const config = readApiConfig(process.env);
const app = createApp(config);

const server = app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});

function shutdown(): void {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
