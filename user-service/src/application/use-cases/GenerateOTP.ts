import { randomInt } from "crypto";
import { IUser } from "../interfaces/IUserEntity";
import { IUserRepository } from "../interfaces/IUserRepository";
import { OTPEntity } from "../../domain/entities/OTPEntity";
import { IOTPRepository } from "../interfaces/IOTPRepository";
import { ITokenManager } from "../interfaces/ITokenManager";
import { IRegisterTokenPayload } from "../interfaces/IRegisterTokenPayload";

import bcrypt from "bcrypt";
import { MailService } from "../../infrastructure/services/MailService";

export class GenerateOTP {
  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOTPRepository,
    private registerTokenManger: ITokenManager<IRegisterTokenPayload>,
    private mailService: MailService
  ) {}

  async execute(user: IUser) {
    await this.isUserExist(user.email, user.username);

    this.validateUsername(user.username);
    this.validateEmail(user.email);
    this.validatePassword(user.password);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const otp = `${randomInt(0,9)}${randomInt(0,9)}${randomInt(0,9)}${randomInt(0,9)}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.otpRepo.save(new OTPEntity(user.email, otp, expiresAt));
    await this.mailService.sendMail({
      to: user.email,
      subject: "Register OTP",
      text: `Your OTP${otp}`,
      html: `<h2>Your OTP is ${otp} </h2>`,
    });

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
