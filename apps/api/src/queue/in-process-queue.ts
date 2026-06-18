export class InProcessQueue {
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
