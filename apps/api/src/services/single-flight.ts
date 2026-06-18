export class SingleFlight<TKey, TValue> {
  private readonly inFlight = new Map<TKey, Promise<TValue>>();

  public run(key: TKey, task: () => Promise<TValue>): Promise<TValue> {
    const existingTask = this.inFlight.get(key);

    if (existingTask) {
      return existingTask;
    }

    const nextTask = task().finally(() => {
      this.inFlight.delete(key);
    });

    this.inFlight.set(key, nextTask);

    return nextTask;
  }
}
