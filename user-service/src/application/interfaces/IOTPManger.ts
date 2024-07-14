export interface IOTPManager {
  generateOTP: (leng?: number) => string;
  saveOTP: (email: string, otp: string) => Promise<void>;
  mailOTP: (email: string, otp: string, subject: string) => Promise<void>;
  validateOTP: (otp: string, email: string) => Promise<boolean>;
}
