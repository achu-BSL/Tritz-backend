import { IResetPasswordPayload } from "../../application/interfaces/IResetPasswordPayload";
import { ITokenManager } from "../../application/interfaces/ITokenManager";

import jwt from "jsonwebtoken";

export class ResetPasswordTokenManager
  implements ITokenManager<IResetPasswordPayload>
{
  constructor() {}

  private readonly SECRET = process.env.REST_PASSWORD_TOKEN_SECRET!;

  generate(payload: IResetPasswordPayload) {
    return jwt.sign(payload, this.SECRET);
  }

  verify(token: string) {
    return jwt.verify(token, this.SECRET) as IResetPasswordPayload;
  }
}
