import { IUser } from "../../application/interfaces/IUserEntity";

export class User implements IUser {
  public username: string;
  public email: string;
  public password: string;
  public userId: string;

  constructor({ username, email, userId, password }: IUser) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.userId = userId;
  }
}
