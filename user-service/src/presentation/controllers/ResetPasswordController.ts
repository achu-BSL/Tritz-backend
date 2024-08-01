import { Response } from "express";
import { IRequest } from "../../application/interfaces/IRequest";
import { IResetPasswordPayload } from "../../application/interfaces/IResetPasswordPayload";
import { ResetPassword } from "../../application/use-cases/ResetPassword";
import { ACCESS_TOKEN_COOKIE_KEY } from "../../config/constant";

export class ResetPasswordController {
  constructor(private readonly resetPassword: ResetPassword) {}

  async handle(req: IRequest<IResetPasswordPayload>, res: Response) {
    const { email } = req.user!;
    const { newPassword } = req.body;
    try {
      const accessToken = await this.resetPassword.execute(email, newPassword);
      res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken);
      res.status(200).json({ msg: "Password has been updated successfully", accessToken });
    } catch (err) {
      res
        .status((err as Error & { statusCode: number })?.statusCode || 500)
        .send({ msg: (err as Error).message });
    }
  }
}
