import { IUser } from "../interfaces/IUserEntity";
import { IUserRepository } from "../interfaces/IUserRepository";
import { ITokenManager } from "../interfaces/ITokenManager";
import { IRegisterTokenPayload } from "../interfaces/IRegisterTokenPayload";

import bcrypt from "bcrypt";
import { IOTPManager } from "../interfaces/IOTPManger";

export class GenerateOTP {
  constructor(
    private userRepo: IUserRepository,
    private otpManager: IOTPManager,
    private registerTokenManger: ITokenManager<IRegisterTokenPayload>
  ) {}

  async execute(user: IUser) {
    await this.isUserExist(user.email, user.username);

    this.validateUsername(user.username);
    this.validateEmail(user.email);
    this.validatePassword(user.password);

    const otp = this.otpManager.generateOTP(4);
    await this.otpManager.saveOTP(user.email, otp);
    await this.otpManager.mailOTP(user.email, otp);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const token = this.registerTokenManger.generate(
      {
        username: user.username,
        email: user.email,
        password: hashedPassword,
      },
      "1h"
    );

    return token;
  }

  private async isUserExist(email: string, username: string) {
    const user = await this.userRepo.findUserByEmailOrUsername(email, username);
    if (user) {
      throw Object.assign(new Error("User already exist"), { statusCode: 400 });
    }
  }

  private validateUsername(username: string) {
    let valid = true;
    if (!username) valid = false;
    else if (username.length < 4) valid = false;

    if (!valid)
      throw Object.assign(new Error("Invalid username"), { statusCode: 400 });
  }

  private validateEmail(email: string) {
    const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regEx.test(email))
      throw Object.assign(new Error("Invalid email"), { statusCode: 400 });
  }

  private validatePassword(password: string) {
    let valid = true;
    if (!password) valid = false;
    else if (password.length < 8) valid = false;

    if (!valid)
      throw Object.assign(
        new Error("Password must be atleast 8 characters long"),
        { statusCode: 400 }
      );
  }
}
