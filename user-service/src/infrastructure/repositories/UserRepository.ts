import { IUser } from "../../application/interfaces/IUserEntity";
import { IUserRepository } from "../../application/interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  async save(user: IUser) {
    //todo save user in database
    return user;
  }

  async findUserById(_userId: string) {
    return null;
  }

  async findUserByUsername(_username: string) {
    return null;
  }

  async findUserByEmail(_email: string) {
    return null;
  }

  async findUserByEmailOrUsername(_email: string, _username: string) {
    return null;
  }
}
