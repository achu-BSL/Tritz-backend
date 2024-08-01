import { ResetPasswordTokenManager } from "../../infrastructure/security/ResetPasswordTokenManager";
import { IOTPManager } from "../interfaces/IOTPManger";

export class ValidateResetPasswordOTP {
  constructor(private readonly otpManager: IOTPManager, private readonly resetPasswordTokenManager: ResetPasswordTokenManager) {}

  async execute(email: string, otp: string) {
    console.log(otp, "otp")
    await this.otpManager.validateOTP(otp, email);
    const token = this.resetPasswordTokenManager.generate({email});
    return token;
  }
}
