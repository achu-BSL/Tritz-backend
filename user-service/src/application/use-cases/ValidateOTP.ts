import { IAccessTokenPayload } from "../interfaces/IAccessTokenPayload";
import { IOTPRepository } from "../interfaces/IOTPRepository";
import { ITokenManager } from "../interfaces/ITokenManager";
import { IUser } from "../interfaces/IUserEntity";
import { IUserRepository } from "../interfaces/IUserRepository";

export class ValidateOTP {
  constructor(
    private readonly otpRepo: IOTPRepository,
    private readonly userRepo: IUserRepository,
    private readonly accessTokenManager: ITokenManager<IAccessTokenPayload>
  ) {}

  async execute(user: IUser, userOtp: string) {
    console.log(user);
    if (!userOtp || isNaN(+userOtp) || userOtp.length < 4)
      throw Object.assign(new Error("Invalid OTP"), { statusCode: 400 });

    const otp = await this.otpRepo.findByEmail(user.email);
    console.log(otp, userOtp);
    if (!otp)
      throw Object.assign(new Error("OTP Expired"), { statusCode: 400 });

    if (otp.otp !== userOtp)
      throw Object.assign(new Error("Incorrect OTP"), { statusCode: 400 });

    const mongoUser = await this.userRepo.save(user);
    const accessToken = this.accessTokenManager.generate(
      { email: user.email, userId: mongoUser.userId, username: user.username },
      "5d"
    );

    return accessToken;
  }
}
