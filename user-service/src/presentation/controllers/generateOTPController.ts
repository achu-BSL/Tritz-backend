import { Request, Response } from "express";
import { GenerateOTP } from "../../application/use-cases/GenerateOTP";
import { User } from "../../domain/entities/UserEntity";

export class GenerateOTPController {
  constructor(private _useCase: GenerateOTP) {}

  async handle(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password, userId: "" });
    try {
      const token = await this._useCase.execute(user);
      res.status(201).send({registerToken: token, msg: "OTP has been sent successfully"});
    } catch (err) {
        res.status((err as Error & {statusCode: number}).statusCode || 500).send({message: (err as Error).message})
    }
  }
}
