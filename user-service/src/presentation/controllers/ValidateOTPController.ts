import { Response } from "express";
import { ValidateOTP } from "../../application/use-cases/ValidateOTP";
import { IRequest } from "../../application/interfaces/IRequest";
import { IRegisterTokenPayload } from "../../application/interfaces/IRegisterTokenPayload";
import { User } from "../../domain/entities/UserEntity";

export class ValidateOTPController {
  constructor(private readonly _useCase: ValidateOTP) {}
  async handle(req: IRequest<IRegisterTokenPayload>, res: Response) {
    const { otp } = req.body;
    const { username, email, password } = req.user!;
    const user = new User({ userId: "", username, email, password });
    try {
      const accessToken = await this._useCase.execute(user, otp);
      res.cookie("access-token", accessToken, {
        httpOnly: true,
      });
      res.status(201).send({ msg: "OTP Validate successfully", accessToken });
    } catch (err) {
      res
        .status((err as Error & { statusCode: number })?.statusCode || 500)
        .send({ msg: (err as Error).message });
    }
  }
}
