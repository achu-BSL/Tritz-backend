import { Response } from "express";
import { IRequest } from "../../application/interfaces/IRequest";
import { GenerateResetPasswordOTP } from "../../application/use-cases/GenerateResetPasswordOTP";

export class GenerateResetPasswordOTPController {
  constructor(
    private readonly generateResetPasswordOTP: GenerateResetPasswordOTP
  ) {}

  async handle(req: IRequest<{ email: string }>, res: Response) {
    const { email } = req.user!;

    try {
      const token = await this.generateResetPasswordOTP.execute(email);
      res.cookie("reset-password-otp-token", token);
      res.status(200).send({ msg: "OTP has been sent", token });
    } catch (err) {
      res
        .status((err as Error & { statusCode?: number }).statusCode || 500)
        .send({ msg: (err as Error).message });
    }
  }
}
