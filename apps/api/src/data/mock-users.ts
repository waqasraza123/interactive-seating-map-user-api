import type { CreateUserRequest, User } from "@interactive-seating-map/shared";

const databaseDelayMs = 200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class MockUserRepository {
  private readonly users = new Map<string, User>([
    ["1", { id: "1", name: "John Doe", email: "john@example.com" }],
    ["2", { id: "2", name: "Jane Smith", email: "jane@example.com" }],
    ["3", { id: "3", name: "Alice Johnson", email: "alice@example.com" }]
  ]);

  private nextUserId = 4;

  public async findById(id: string): Promise<User | null> {
    await delay(databaseDelayMs);
    const user = this.users.get(id);

    return user ? { ...user } : null;
  }

  public create(input: CreateUserRequest): User {
    const user: User = {
      email: input.email,
      id: String(this.nextUserId),
      name: input.name
    };

    this.nextUserId += 1;
    this.users.set(user.id, user);

    return { ...user };
  }
}
