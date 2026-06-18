import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import type { ApiConfig } from "../src/config.js";

const testConfig: ApiConfig = {
  cacheCleanupIntervalMs: 60_000,
  cacheMaxEntries: 100,
  cacheTtlMs: 60_000,
  port: 0,
  rateLimit: {
    burstLimit: 100,
    burstWindowMs: 10_000,
    minuteLimit: 100,
    minuteWindowMs: 60_000
  }
};

function createTestApp(config: ApiConfig = testConfig) {
  return createApp(config);
}

describe("api routes", () => {
  it("returns health status", async () => {
    const response = await request(createTestApp()).get("/health").expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns the mock user", async () => {
    const response = await request(createTestApp()).get("/users/1").expect(200);

    expect(response.body).toEqual({
      data: {
        email: "john@example.com",
        id: "1",
        name: "John Doe"
      }
    });
  });

  it("returns a meaningful 404 JSON response for a missing user", async () => {
    const response = await request(createTestApp()).get("/users/999").expect(404);

    expect(response.body).toEqual({
      error: {
        code: "USER_NOT_FOUND",
        message: "User 999 does not exist."
      }
    });
  });

  it("records cache misses, hits, and status", async () => {
    const app = createTestApp();

    await request(app).get("/users/1").expect(200);

    const firstStatus = await request(app).get("/cache-status").expect(200);
    expect(firstStatus.body).toMatchObject({
      hits: 0,
      misses: 1,
      size: 1
    });

    await request(app).get("/users/1").expect(200);

    const secondStatus = await request(app).get("/cache-status").expect(200);
    expect(secondStatus.body).toMatchObject({
      hits: 1,
      misses: 1,
      size: 1
    });
  });

  it("clears cached users", async () => {
    const app = createTestApp();

    await request(app).get("/users/1").expect(200);
    await request(app).delete("/cache").expect(200, { data: { cleared: true } });

    const response = await request(app).get("/cache-status").expect(200);
    expect(response.body).toMatchObject({ size: 0 });
  });

  it("creates and caches a user", async () => {
    const app = createTestApp();

    const createResponse = await request(app)
      .post("/users")
      .send({
        email: "sam@example.com",
        name: "Sam Rivera"
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      data: {
        email: "sam@example.com",
        id: "4",
        name: "Sam Rivera"
      }
    });

    const cacheStatus = await request(app).get("/cache-status").expect(200);
    expect(cacheStatus.body).toMatchObject({ size: 1 });

    const getResponse = await request(app).get("/users/4").expect(200);
    expect(getResponse.body).toEqual(createResponse.body);

    const updatedCacheStatus = await request(app).get("/cache-status").expect(200);
    expect(updatedCacheStatus.body).toMatchObject({
      hits: 1,
      misses: 0,
      size: 1
    });
  });

  it("returns 429 when rate limits are exceeded", async () => {
    const app = createTestApp({
      ...testConfig,
      rateLimit: {
        burstLimit: 2,
        burstWindowMs: 10_000,
        minuteLimit: 2,
        minuteWindowMs: 60_000
      }
    });

    await request(app).get("/health").expect(200);
    await request(app).get("/health").expect(200);

    const response = await request(app).get("/health").expect(429);
    expect(response.body).toEqual({
      error: {
        code: "RATE_LIMITED",
        details: {
          burstLimit: 2,
          burstWindowSeconds: 10,
          minuteLimit: 2,
          minuteWindowSeconds: 60
        },
        message: "Too many requests from this IP address. Try again later."
      }
    });
  });
});
