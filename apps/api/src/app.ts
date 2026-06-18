import express, { type Express } from "express";
import type { User } from "@interactive-seating-map/shared";
import { CacheMetrics } from "./cache/cache-metrics.js";
import { LruCache } from "./cache/lru-cache.js";
import { startStaleCacheCleaner } from "./cache/stale-cache-cleaner.js";
import type { ApiConfig } from "./config.js";
import { MockUserRepository } from "./data/mock-users.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { createRateLimiter } from "./middleware/rate-limiter.js";
import { InProcessQueue } from "./queue/in-process-queue.js";
import { createCacheRouter } from "./routes/cache-routes.js";
import { createHealthRouter } from "./routes/health-routes.js";
import { createUserRouter } from "./routes/user-routes.js";
import { SingleFlight } from "./services/single-flight.js";
import { UserService } from "./services/user-service.js";

export function createApp(config: ApiConfig): Express {
  const app = express();
  const userCache = new LruCache<string, User>(config.cacheMaxEntries, config.cacheTtlMs);
  const userService = new UserService({
    cache: userCache,
    fetchQueue: new InProcessQueue(),
    metrics: new CacheMetrics(),
    repository: new MockUserRepository(),
    singleFlight: new SingleFlight()
  });

  startStaleCacheCleaner(userCache, config.cacheCleanupIntervalMs);

  app.use(express.json());
  app.use(createRateLimiter());
  app.use(createHealthRouter());
  app.use(createUserRouter(userService));
  app.use(createCacheRouter(userService));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
