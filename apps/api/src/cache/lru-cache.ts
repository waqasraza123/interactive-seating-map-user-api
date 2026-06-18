type CacheEntry<TValue> = {
  expiresAt: number;
  value: TValue;
};

export class LruCache<TKey, TValue> {
  private readonly entries = new Map<TKey, CacheEntry<TValue>>();

  public constructor(
    private readonly maxEntries: number,
    private readonly ttlMs: number
  ) {}

  public get(key: TKey): TValue | undefined {
    const entry = this.entries.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }

    this.entries.delete(key);
    this.entries.set(key, entry);

    return entry.value;
  }

  public hasFresh(key: TKey): boolean {
    return this.get(key) !== undefined;
  }

  public set(key: TKey, value: TValue): void {
    if (this.entries.has(key)) {
      this.entries.delete(key);
    }

    this.entries.set(key, {
      expiresAt: Date.now() + this.ttlMs,
      value
    });

    while (this.entries.size > this.maxEntries) {
      const oldestKey = this.entries.keys().next().value;

      if (oldestKey === undefined) {
        return;
      }

      this.entries.delete(oldestKey);
    }
  }

  public clear(): void {
    this.entries.clear();
  }

  public clearStale(now = Date.now()): number {
    let clearedCount = 0;

    for (const [key, entry] of this.entries.entries()) {
      if (entry.expiresAt <= now) {
        this.entries.delete(key);
        clearedCount += 1;
      }
    }

    return clearedCount;
  }

  public size(): number {
    this.clearStale();
    return this.entries.size;
  }
}
