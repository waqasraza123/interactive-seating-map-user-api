import type { User } from "@interactive-seating-map/shared";
import { describe, expect, it } from "vitest";
import { CacheMetrics } from "../src/cache/cache-metrics.js";
import { LruCache } from "../src/cache/lru-cache.js";
import { InProcessQueue } from "../src/queue/in-process-queue.js";
import { MockUserRepository } from "../src/data/mock-users.js";
import { SingleFlight } from "../src/services/single-flight.js";
import { UserService } from "../src/services/user-service.js";

class CountingUserRepository extends MockUserRepository {
  public findCount = 0;

  public override async findById(id: string): Promise<User | null> {
    this.findCount += 1;

    return {
      email: `${id}@example.com`,
      id,
      name: `User ${id}`
    };
  }
}

describe("user service", () => {
  it("deduplicates concurrent same-user fetches", async () => {
    const repository = new CountingUserRepository();
    const service = new UserService({
      cache: new LruCache<string, User>(100, 60_000),
      fetchQueue: new InProcessQueue(),
      metrics: new CacheMetrics(),
      repository,
      singleFlight: new SingleFlight()
    });

    const users = await Promise.all([service.getUserById("1"), service.getUserById("1"), service.getUserById("1")]);

    expect(repository.findCount).toBe(1);
    expect(users).toEqual([
      {
        email: "1@example.com",
        id: "1",
        name: "User 1"
      },
      {
        email: "1@example.com",
        id: "1",
        name: "User 1"
      },
      {
        email: "1@example.com",
        id: "1",
        name: "User 1"
      }
    ]);
  });
});
