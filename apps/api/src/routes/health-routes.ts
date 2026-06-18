import type { HealthStatus } from "@interactive-seating-map/shared";
import { Router, type Response } from "express";

export function createHealthRouter(): Router {
  const router = Router();

  router.get("/health", (_request, response: Response<HealthStatus>) => {
    response.json({ status: "ok" });
  });

  return router;
}
