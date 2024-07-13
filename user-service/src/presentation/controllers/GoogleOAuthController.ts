import { Request, Response } from "express";
import { GoogleOAuth } from "../../application/use-cases/GoogleOAuth";

export class GoogleOAuthController {
  constructor(private readonly googleOAuth: GoogleOAuth) {}

  async handle(req: Request, res: Response) {
    const { code } = req.body;
    try {
      const token = await this.googleOAuth.execute(code);
      res.send({ msg: "login successfully", accessToken: token });
    } catch (err) {
      res
        .status((err as Error & { statusCode?: number }).statusCode || 500)
        .send({ msg: (err as Error).message });
    }
  }
}
