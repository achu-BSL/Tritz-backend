import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import * as bcrypt from "bcrypt";
import { AccessTokenManager } from "../../infrastructure/security/AccessTokenManager";

export class ResetPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessTokenManager: AccessTokenManager
  ) {}

  async execute(email: string, password: string) {
    this.validatePassword(password);
    const hashPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.userRepository.updateUserByEmail(email, {
      password: hashPassword,
    });
    if (!updatedUser)
      throw Object.assign(new Error("User not fond within the email"), {
        statusCode: 404,
      });
    return this.accessTokenManager.generate({
      email: updatedUser.email,
      userId: updatedUser.userId,
      username: updatedUser.username,
    });
  }

  private validatePassword(password: string) {
    if (!password)
      throw Object.assign(new Error("Password required"), { statusCode: 400 });
    if (password.trim().length < 8)
      throw Object.assign(new Error("Invalid password"), { statusCode: 400 });
  }
}
