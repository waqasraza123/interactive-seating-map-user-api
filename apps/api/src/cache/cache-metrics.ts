import type { CacheStatus } from "@interactive-seating-map/shared";

export class CacheMetrics {
  private hitCount = 0;
  private missCount = 0;
  private responseCount = 0;
  private totalResponseTimeMs = 0;

  public recordHit(responseTimeMs: number): void {
    this.hitCount += 1;
    this.recordResponseTime(responseTimeMs);
  }

  public recordMiss(responseTimeMs: number): void {
    this.missCount += 1;
    this.recordResponseTime(responseTimeMs);
  }

  public snapshot(size: number): CacheStatus {
    return {
      averageResponseTimeMs: this.responseCount === 0 ? 0 : Number((this.totalResponseTimeMs / this.responseCount).toFixed(2)),
      hits: this.hitCount,
      misses: this.missCount,
      size
    };
  }

  private recordResponseTime(responseTimeMs: number): void {
    this.responseCount += 1;
    this.totalResponseTimeMs += responseTimeMs;
  }
}
