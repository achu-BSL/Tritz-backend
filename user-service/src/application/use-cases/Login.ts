import { AccessTokenManager } from "../../infrastructure/security/AccessTokenManager";
import { IUserRepository } from "../interfaces/IUserRepository";
import bcrypt from "bcrypt";

export class Login {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly accessTokenManager: AccessTokenManager
  ) {}

  async execute(email: string, password: string) {
    this.validateEmail(email);
    this.validatePassword(password);

    const user = await this.userRepo.findUserByEmail(email);
    if (!user)
      throw Object.assign(new Error("User does not exist"), {
        statusCode: 400,
      });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw Object.assign(new Error("Incorrect password"), { statusCode: 400 });

    const { username, userId } = user;

    const accessToken = this.accessTokenManager.generate(
      {
        userId,
        username,
        email,
      },
      "5d"
    );

    return accessToken;
  }

  private validateEmail(email: string) {
    const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regEx.test(email))
      throw Object.assign(new Error("Invalid Email"), { statusCode: 400 });
  }

  private validatePassword(password: string) {
    if (!password || password.length < 8)
      throw Object.assign(new Error("Password must be atleast 8 characters"));
  }
}
