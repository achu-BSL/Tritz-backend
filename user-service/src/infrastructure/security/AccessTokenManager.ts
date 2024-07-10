import { IAccessTokenPayload } from "../../application/interfaces/IAccessTokenPayload";
import { ITokenManager } from "../../application/interfaces/ITokenManager";
import jwt from "jsonwebtoken";



export class AccessTokenManager implements ITokenManager<IAccessTokenPayload> {
  private readonly SECRET = process.env.ACCESS_TOKEN_SECRET!;
  generate(payload: IAccessTokenPayload, expiry: string) {
    return jwt.sign(payload, this.SECRET, { expiresIn: expiry });
  }

  decode(token: string) {
    return jwt.verify(token, this.SECRET) as IAccessTokenPayload;
  }
}
