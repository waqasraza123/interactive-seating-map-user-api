import type { ApiErrorResponse } from "@interactive-seating-map/shared";
import type { RequestHandler } from "express";

export type RateLimitConfig = {
  burstLimit: number;
  burstWindowMs: number;
  minuteLimit: number;
  minuteWindowMs: number;
};

const defaultConfig: RateLimitConfig = {
  burstLimit: 5,
  burstWindowMs: 10_000,
  minuteLimit: 10,
  minuteWindowMs: 60_000
};

export function createRateLimiter(config: RateLimitConfig = defaultConfig): RequestHandler {
  const requestsByIp = new Map<string, number[]>();

  return (request, response, next) => {
    const now = Date.now();
    const ipAddress = request.ip || request.socket.remoteAddress || "unknown";
    const currentRequests = requestsByIp.get(ipAddress) ?? [];
    const activeRequests = currentRequests.filter((timestamp) => now - timestamp < config.minuteWindowMs);
    const burstRequests = activeRequests.filter((timestamp) => now - timestamp < config.burstWindowMs);

    if (activeRequests.length >= config.minuteLimit || burstRequests.length >= config.burstLimit) {
      const payload: ApiErrorResponse = {
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests from this IP address. Try again later.",
          details: {
            burstLimit: config.burstLimit,
            burstWindowSeconds: config.burstWindowMs / 1000,
            minuteLimit: config.minuteLimit,
            minuteWindowSeconds: config.minuteWindowMs / 1000
          }
        }
      };

      response.status(429).json(payload);
      return;
    }

    activeRequests.push(now);
    requestsByIp.set(ipAddress, activeRequests);
    next();
  };
}
