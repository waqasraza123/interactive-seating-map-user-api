import { createApp } from "./app.js";
import { readApiConfig } from "./config.js";

const config = readApiConfig(process.env);
const app = createApp();

app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});
