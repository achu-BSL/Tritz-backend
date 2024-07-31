import { Request, Response } from "express";
import { GenerateResetPasswordOTP } from "../../application/use-cases/GenerateResetPasswordOTP";
import { RESET_PASSWORD_OTP_TOKEN_COOKIE_KEY } from "../../config/constant";

export class GenerateResetPasswordOTPController {
  constructor(
    private readonly generateResetPasswordOTP: GenerateResetPasswordOTP
  ) {}

  async handle(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const token = await this.generateResetPasswordOTP.execute(email);
      res.cookie(RESET_PASSWORD_OTP_TOKEN_COOKIE_KEY, token);
      res.status(200).send({ msg: "OTP has been sent", token });
    } catch (err) {
      res
        .status((err as Error & { statusCode?: number }).statusCode || 500)
        .send({ msg: (err as Error).message });
    }
  }
}
