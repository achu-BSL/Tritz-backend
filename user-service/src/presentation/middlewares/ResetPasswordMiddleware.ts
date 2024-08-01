import { NextFunction, Response } from "express";
import { IRequest } from "../../application/interfaces/IRequest";
import { IResetPasswordPayload } from "../../application/interfaces/IResetPasswordPayload";
import { ResetPasswordTokenManager } from "../../infrastructure/security/ResetPasswordTokenManager";
import { RESET_PASSWORD_TOKEN_COOKIE_KEY } from "../../config/constant";

export class ResetPasswordMiddleware {
  constructor(
    private readonly resetPasswordTokenManager: ResetPasswordTokenManager
  ) {}

  async use(
    req: IRequest<IResetPasswordPayload>,
    res: Response,
    next: NextFunction
  ) {
    const accessToken = req.cookies[RESET_PASSWORD_TOKEN_COOKIE_KEY];
    try {
      if (!accessToken) throw new Error("reset password token required");
      const payload = this.resetPasswordTokenManager.verify(accessToken);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).send({ msg: (err as Error).message });
    }
  }
}
