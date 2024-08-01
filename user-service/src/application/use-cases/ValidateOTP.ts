import { IAccessTokenPayload } from "../interfaces/IAccessTokenPayload";
import { IOTPManager } from "../interfaces/IOTPManger";
import { ITokenManager } from "../interfaces/ITokenManager";
import { IUser } from "../interfaces/IUserEntity";
import { IUserRepository } from "../interfaces/IUserRepository";

export class ValidateOTP {
  constructor(
    private readonly otpManager: IOTPManager,
    private readonly userRepo: IUserRepository,
    private readonly accessTokenManager: ITokenManager<IAccessTokenPayload>
  ) {}

  async execute(user: IUser, userOtp: string) {
    if (!userOtp || isNaN(+userOtp) || userOtp.length < 4)
      throw Object.assign(new Error("Invalid OTP"), { statusCode: 400 });

    await this.otpManager.validateOTP(userOtp, user.email);

    const mongoUser = await this.userRepo.save(user);
    const accessToken = this.accessTokenManager.generate(
      { email: user.email, userId: mongoUser.userId, username: user.username },
      "5d"
    );

    return accessToken;
  }
}
