import { ResetPasswordOTPTokenManager } from "../../infrastructure/security/ResetPasswordOTPTokenManager";
import { IOTPManager } from "../interfaces/IOTPManger";
import { IUserRepository } from "../interfaces/IUserRepository";

export class GenerateResetPasswordOTP {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpManager: IOTPManager,
    private readonly resetPasswordOTPTokenManager: ResetPasswordOTPTokenManager
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user)
      throw Object.assign(new Error("User not found"), { statusCode: 400 });

    const otp = this.otpManager.generateOTP(4);
    await this.otpManager.saveOTP(email, otp);
    await this.otpManager.mailOTP(email, otp, "Reset Password OTP");

    const token = this.resetPasswordOTPTokenManager.generate({ email });

    return token;
  }
}
