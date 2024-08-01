import { Response } from "express";
import { IRequest } from "../../application/interfaces/IRequest";
import { IResetPasswordPayload } from "../../application/interfaces/IResetPasswordPayload";
import { ResetPassword } from "../../application/use-cases/ResetPassword";

export class ResetPasswordController {
  constructor(private readonly resetPassword: ResetPassword) {}

  async handle(req: IRequest<IResetPasswordPayload>, res: Response) {
    const { email } = req.user!;
    const { newPassword } = req.body;
    try {
      await this.resetPassword.execute(email, newPassword);
      res.status(200).json({ msg: "Password has been updated successfully" });
    } catch (err) {
      res
        .status((err as Error & { statusCode: number })?.statusCode || 500)
        .send({ msg: (err as Error).message });
    }
  }
}
