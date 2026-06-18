import type { CreateUserRequest } from "@interactive-seating-map/shared";
import { HttpError } from "../errors/http-error.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userIdPattern = /^\d+$/;

export function parseUserId(value: string | string[] | undefined): string {
  if (typeof value !== "string" || !userIdPattern.test(value)) {
    throw new HttpError(400, "INVALID_USER_ID", "User ID must be a positive integer string.");
  }

  return value;
}

export function parseCreateUserBody(body: unknown): CreateUserRequest {
  if (!isRecord(body)) {
    throw new HttpError(400, "INVALID_REQUEST_BODY", "Request body must be a JSON object.");
  }

  const name = body.name;
  const email = body.email;

  if (typeof name !== "string" || name.trim().length === 0) {
    throw new HttpError(400, "INVALID_USER_NAME", "User name is required.");
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    throw new HttpError(400, "INVALID_USER_EMAIL", "A valid email address is required.");
  }

  return {
    email: email.trim().toLowerCase(),
    name: name.trim()
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
