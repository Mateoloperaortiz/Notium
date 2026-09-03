import { mockUsers } from '@/data/mockData';
import type User from '@/models/User';

export class UserService {
  private readonly currentUserId: string | undefined;
  private readonly users: User[];

  public constructor(
    users: User[] = mockUsers,
    currentUserId: string | undefined = users[0]?.getId(),
  ) {
    this.users = users;
    this.currentUserId = currentUserId;
  }

  public async findAll(): Promise<User[]> {
    return [...this.users];
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find((user: User): boolean => user.getId() === id);
  }

  public async findCurrent(): Promise<User | undefined> {
    if (this.currentUserId === undefined) {
      return undefined;
    }

    return this.findById(this.currentUserId);
  }
}

export const userService = new UserService();

export default userService;
