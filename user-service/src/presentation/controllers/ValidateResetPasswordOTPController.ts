import { Response } from "express";
import { IRequest } from "../../application/interfaces/IRequest";
import { IResetPasswordOTPPayload } from "../../application/interfaces/IResetPasswordOTPPayload";
import { ValidateResetPasswordOTP } from "../../application/use-cases/ValidateResetPasswordOTP";
import { RESET_PASSWORD_TOKEN_COOKIE_KEY } from "../../config/constant";

export class ValidateResetPasswordOTPController {
  constructor(private readonly _useCase: ValidateResetPasswordOTP) {}

  async handle(req: IRequest<IResetPasswordOTPPayload>, res: Response) {
    const { email } = req.user!;
    const otp = req.body;
    try {
      const resetPasswordToken = await this._useCase.execute(email!, otp);
      res.cookie(RESET_PASSWORD_TOKEN_COOKIE_KEY, resetPasswordToken);
    } catch (err) {
        res.status((err as Error & {statusCode?: number}).statusCode || 500).send({msg: (err as Error).message})
    }
  }
}
