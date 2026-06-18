import type { RateLimitConfig } from "./middleware/rate-limiter.js";

export type ApiConfig = {
  cacheCleanupIntervalMs: number;
  cacheMaxEntries: number;
  cacheTtlMs: number;
  port: number;
  rateLimit?: RateLimitConfig;
};

const cacheCleanupIntervalMs = 10_000;
const cacheMaxEntries = 100;
const cacheTtlMs = 60_000;
const defaultPort = 3000;

export function readApiConfig(environment: NodeJS.ProcessEnv): ApiConfig {
  const portValue = environment.PORT;
  const port = portValue ? Number.parseInt(portValue, 10) : defaultPort;

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return {
    cacheCleanupIntervalMs,
    cacheMaxEntries,
    cacheTtlMs,
    port
  };
}
