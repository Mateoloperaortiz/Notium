import type { CreateUserDTO, UpdateUserDTO } from '@/dtos/UserDTOs.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useUserStore } from '@/stores/UserStore.js';

const generateUserId = (): string => globalThis.crypto.randomUUID();

export class UserService {
  public static async findAll(): Promise<UserInterface[]> {
    return [...useUserStore().users];
  }

  public static async findById(id: string): Promise<UserInterface | undefined> {
    return useUserStore().users.find((user: UserInterface): boolean => user.id === id);
  }

  public static async findCurrent(): Promise<UserInterface | undefined> {
    return useAuthStore().currentUser ?? undefined;
  }

  public static async create(dto: CreateUserDTO): Promise<UserInterface> {
    const timestamp = Date.now();
    const user: UserInterface = {
      ...dto,
      createdAt: timestamp,
      id: generateUserId(),
      semesters: [],
      updatedAt: timestamp,
    };

    useUserStore().users.push(user);

    return user;
  }

  public static async update(id: string, dto: UpdateUserDTO): Promise<UserInterface | undefined> {
    const user = await UserService.findById(id);

    if (user === undefined) {
      return undefined;
    }

    Object.assign(user, dto, { updatedAt: Date.now() });

    return user;
  }

  public static async delete(id: string): Promise<boolean> {
    const users = useUserStore().users;
    const userIndex = users.findIndex((user: UserInterface): boolean => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    if (useAuthStore().currentUser?.id === id) {
      useAuthStore().logout();
    }

    users.splice(userIndex, 1);

    return true;
  }
}
