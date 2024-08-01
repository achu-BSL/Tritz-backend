import { IUser } from "./IUserEntity";

export interface IUserRepository {
  save: (user: IUser) => Promise<IUser>;
  findUserById: (userId: string) => Promise<IUser | null>;
  findUserByUsername: (username: string) => Promise<IUser | null>;
  findUserByEmail: (email: string) => Promise<IUser | null>;
  findUserByEmailOrUsername: (
    email: string,
    username: string
  ) => Promise<IUser | null>;
  updateUserByEmail: (email: string, updatedUser: Partial<IUser>) => Promise<IUser | null>;
}
