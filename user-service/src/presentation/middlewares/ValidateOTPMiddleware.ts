import { NextFunction, Response } from "express";
import { RegisterTokenManager } from "../../infrastructure/security/RegisterTokenManager";
import { IRequest } from "../../application/interfaces/IRequest";
import { IRegisterTokenPayload } from "../../application/interfaces/IRegisterTokenPayload";

export class ValidateOTPMiddleware {
  constructor(private readonly registerTokenManager: RegisterTokenManager) {}
  async use(
    req: IRequest<IRegisterTokenPayload>,
    res: Response,
    next: NextFunction
  ) {
    const accessToken = req.cookies["register-token"];
    try {
      if (!accessToken) throw new Error("register token required");
      const payload = this.registerTokenManager.verify(
        accessToken
      );
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).send({ msg: (err as Error).message });
    }
  }
}
