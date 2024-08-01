import { NextFunction, Response } from "express";
import { ResetPasswordOTPTokenManager } from "../../infrastructure/security/ResetPasswordOTPTokenManager";
import { IRequest } from "../../application/interfaces/IRequest";
import { RESET_PASSWORD_OTP_TOKEN_COOKIE_KEY } from "../../config/constant";
import { IResetPasswordOTPPayload } from "../../application/interfaces/IResetPasswordOTPPayload";

export class ValidateResetPasswordOTPMiddleware {
  constructor(
    private readonly resetPasswordOTPTokenManger: ResetPasswordOTPTokenManager
  ) {}

  async use(
    req: IRequest<IResetPasswordOTPPayload>,
    res: Response,
    next: NextFunction
  ) {
    const token = req.cookies[RESET_PASSWORD_OTP_TOKEN_COOKIE_KEY];
    try {
      if (!token) throw new Error("reset password otp token required");
      const payload = this.resetPasswordOTPTokenManger.verify(token);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).send({ msg: (err as Error).message });
    }
  }
}
