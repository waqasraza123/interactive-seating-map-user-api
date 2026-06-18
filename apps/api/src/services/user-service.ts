import type { CacheStatus, CreateUserRequest, User } from "@interactive-seating-map/shared";
import { performance } from "node:perf_hooks";
import type { CacheMetrics } from "../cache/cache-metrics.js";
import type { LruCache } from "../cache/lru-cache.js";
import type { MockUserRepository } from "../data/mock-users.js";
import type { InProcessQueue } from "../queue/in-process-queue.js";
import type { SingleFlight } from "./single-flight.js";

export type UserServiceDependencies = {
  cache: LruCache<string, User>;
  metrics: CacheMetrics;
  repository: MockUserRepository;
  fetchQueue: InProcessQueue;
  singleFlight: SingleFlight<string, User | null>;
};

export class UserService {
  public constructor(private readonly dependencies: UserServiceDependencies) {}

  public async getUserById(id: string): Promise<User | null> {
    const startTime = performance.now();
    let cacheHit = false;

    try {
      const cachedUser = this.dependencies.cache.get(id);

      if (cachedUser) {
        cacheHit = true;
        return cachedUser;
      }

      return await this.dependencies.singleFlight.run(id, async () => {
        const userCachedDuringWait = this.dependencies.cache.get(id);

        if (userCachedDuringWait) {
          return userCachedDuringWait;
        }

        const user = await this.dependencies.fetchQueue.enqueue(() => this.dependencies.repository.findById(id));

        if (user && !this.dependencies.cache.hasFresh(id)) {
          this.dependencies.cache.set(id, user);
        }

        return user;
      });
    } finally {
      const responseTimeMs = performance.now() - startTime;

      if (cacheHit) {
        this.dependencies.metrics.recordHit(responseTimeMs);
      } else {
        this.dependencies.metrics.recordMiss(responseTimeMs);
      }
    }
  }

  public createUser(input: CreateUserRequest): User {
    const user = this.dependencies.repository.create(input);

    if (!this.dependencies.cache.hasFresh(user.id)) {
      this.dependencies.cache.set(user.id, user);
    }

    return user;
  }

  public clearCache(): void {
    this.dependencies.cache.clear();
  }

  public getCacheStatus(): CacheStatus {
    return this.dependencies.metrics.snapshot(this.dependencies.cache.size());
  }
}
