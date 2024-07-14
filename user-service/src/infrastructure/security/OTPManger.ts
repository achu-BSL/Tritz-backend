import { randomInt } from "crypto";
import { IOTPManager } from "../../application/interfaces/IOTPManger";
import { IOTPRepository } from "../../application/interfaces/IOTPRepository";
import { OTPEntity } from "../../domain/entities/OTPEntity";
import { MailService } from "../services/MailService";

export class OTPManager implements IOTPManager {
  constructor(
    private readonly otpRepository: IOTPRepository,
    private readonly mailService: MailService
  ) {}

  generateOTP(leng = 4) {
    let otp = "";
    for (let n = 1; n <= Math.min(leng, 6); n++) otp += `${randomInt(9)}`;
    return otp;
  }

  async saveOTP(email: string, otp: string) {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    try {
      await this.otpRepository.save(new OTPEntity(email, otp, expiresAt));
    } catch (err) {
      throw Object.assign(new Error("Error while trying to save otp"), {
        statusCode: 503,
      });
    }
  }

  async mailOTP(email: string, otp: string) {
    try {
      await this.mailService.sendMail({
        to: email,
        subject: "Register OTP",
        text: `Your OTP${otp}`,
        html: `<h2>Your OTP is ${otp} </h2>`,
      });
    } catch (err) {
      throw Object.assign(new Error("Error while mail otp"), {
        statusCode: 503,
      });
    }
  }

  async validateOTP(userOtp: string, email: string) {
    const otp = await this.otpRepository.findByEmail(email);
    if (!otp || otp.expiresAt < new Date(Date.now()))
      throw Object.assign(new Error("OTP Expired"), { statusCode: 400 });

    if (otp.otp !== userOtp)
      throw Object.assign(new Error("Incorrect OTP"), { statusCode: 400 });
    return true;
  }
}
