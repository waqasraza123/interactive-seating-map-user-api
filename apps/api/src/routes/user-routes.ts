import type { ApiDataResponse, User } from "@interactive-seating-map/shared";
import { Router, type Response } from "express";
import { HttpError } from "../errors/http-error.js";
import { asyncHandler } from "../middleware/async-handler.js";
import type { UserService } from "../services/user-service.js";
import { parseCreateUserBody, parseUserId } from "../validation/users.js";

type UserResponse = ApiDataResponse<User>;

export function createUserRouter(userService: UserService): Router {
  const router = Router();

  router.get(
    "/users/:id",
    asyncHandler(async (request, response: Response<UserResponse>) => {
      const userId = parseUserId(request.params.id);
      const user = await userService.getUserById(userId);

      if (!user) {
        throw new HttpError(404, "USER_NOT_FOUND", `User ${userId} does not exist.`);
      }

      response.json({ data: user });
    })
  );

  router.post(
    "/users",
    asyncHandler(async (request, response: Response<UserResponse>) => {
      const input = parseCreateUserBody(request.body);
      const user = userService.createUser(input);

      response.status(201).json({ data: user });
    })
  );

  return router;
}
