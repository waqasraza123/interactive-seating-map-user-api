export class InProcessQueue {
  // Serializes mock repository work without adding infrastructure outside the assignment scope.
  private tail: Promise<void> = Promise.resolve();

  public enqueue<TValue>(task: () => Promise<TValue>): Promise<TValue> {
    const nextTask = this.tail.then(task, task);
    this.tail = nextTask.then(
      () => undefined,
      () => undefined
    );

    return nextTask;
  }
}
