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
    const bearerToken = req.headers.authorization;
    try {
      if (!bearerToken) throw new Error("register token required");
      if (typeof bearerToken !== "string")
        throw new Error("Invalid register token");
      const payload = this.registerTokenManager.decode(
        bearerToken.split(" ")[1]
      );
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).send({ msg: (err as Error).message });
    }
  }
}
