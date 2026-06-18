import type { LruCache } from "./lru-cache.js";

export function startStaleCacheCleaner<TValue>(cache: LruCache<string, TValue>, intervalMs: number): NodeJS.Timeout {
  const timer = setInterval(() => {
    cache.clearStale();
  }, intervalMs);

  timer.unref();

  return timer;
}
