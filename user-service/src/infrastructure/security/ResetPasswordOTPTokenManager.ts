import { IResetPasswordOTPPayload } from "../../application/interfaces/IResetPasswordOTPPayload";
import { ITokenManager } from "../../application/interfaces/ITokenManager";

import jwt from "jsonwebtoken";

export class ResetPasswordOTPTokenManager
  implements ITokenManager<IResetPasswordOTPPayload>
{
  private readonly RESET_PASSWORD_OTP_TOKEN_SECRET =
    process.env.RESET_PASSWORD_OTP_TOKEN_SECRET!;

  generate(payload: IResetPasswordOTPPayload) {
    return jwt.sign(payload, this.RESET_PASSWORD_OTP_TOKEN_SECRET);
  }

  verify(token: string) {
    return jwt.verify(
      token,
      this.RESET_PASSWORD_OTP_TOKEN_SECRET
    ) as IResetPasswordOTPPayload;
  }
}
