import { Request, Response } from "express";
import { Login } from "../../application/use-cases/Login";

export class LoginController {
  constructor(private readonly _useCase: Login) {}

  async handle(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const accessToken = await this._useCase.execute(email, password);
      res.status(200).send({ msg: "Login successfully", accessToken });
    } catch (err) {
      res
        .status((err as Error & { statusCode?: number }).statusCode || 500)
        .send({ msg: (err as Error).message });
    }
  }
}
