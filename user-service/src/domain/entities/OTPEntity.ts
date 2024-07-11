import { IOTPEntity } from "../../application/interfaces/IOTPEntity";

export class OTPEntity implements IOTPEntity {
  constructor(
    public email: string,
    public otp: string,
    public expiresAt: Date
  ) {}
}
