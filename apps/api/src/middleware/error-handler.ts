import type { ApiErrorResponse } from "@interactive-seating-map/shared";
import type { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/http-error.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) {
    const payload: ApiErrorResponse = {
      error: {
        code: error.code,
        message: error.message
      }
    };

    if (error.details !== undefined) {
      payload.error.details = error.details;
    }

    response.status(error.statusCode).json(payload);
    return;
  }

  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred."
    }
  } satisfies ApiErrorResponse);
};
