import type { ApiDataResponse, CacheStatus } from "@interactive-seating-map/shared";
import { Router, type Response } from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import type { UserService } from "../services/user-service.js";

type ClearCacheResponse = ApiDataResponse<{
  cleared: true;
}>;

export function createCacheRouter(userService: UserService): Router {
  const router = Router();

  router.get(
    "/cache-status",
    asyncHandler(async (_request, response: Response<CacheStatus>) => {
      response.json(userService.getCacheStatus());
    })
  );

  router.delete(
    "/cache",
    asyncHandler(async (_request, response: Response<ClearCacheResponse>) => {
      userService.clearCache();
      response.json({ data: { cleared: true } });
    })
  );

  return router;
}
