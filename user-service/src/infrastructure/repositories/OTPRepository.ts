import { IOTPEntity } from "../../application/interfaces/IOTPEntity";
import { IOTPRepository } from "../../application/interfaces/IOTPRepository";
import { OTPEntity } from "../../domain/entities/OTPEntity";
import otpModel from "../database/model/OTPModel";

export class OTPRepository implements IOTPRepository {
  async save(otp: IOTPEntity) {
    const mongoOTP = new otpModel({
      otp: otp.otp,
      email: otp.email,
      expireAt: otp.expiresAt,
    });

    await mongoOTP.save();
  }

  async findByEmail(email: string) {
    const mongoOTP = await otpModel.findOne({ email });
    if (!mongoOTP) return null;
    return new OTPEntity(mongoOTP.email, mongoOTP.otp, mongoOTP.expireAt);
  }
}
