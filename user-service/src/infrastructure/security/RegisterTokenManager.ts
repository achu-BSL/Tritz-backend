import { IRegisterTokenPayload } from "../../application/interfaces/IRegisterTokenPayload";
import { ITokenManager } from "../../application/interfaces/ITokenManager";
import jwt from "jsonwebtoken";

export class RegisterTokenManager
  implements ITokenManager<IRegisterTokenPayload>
{
  private readonly SECRET = process.env.REGISTER_TOKEN_SECRET!;
  generate(payload: IRegisterTokenPayload, expiry: string) {
    return jwt.sign(payload, this.SECRET, { expiresIn: expiry });
  }

  verify(token: string) {
    return jwt.verify(token, this.SECRET) as IRegisterTokenPayload;
  }
}
