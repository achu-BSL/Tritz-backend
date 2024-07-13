import { GoogleOAuthManager } from "../../infrastructure/security/GoogleOAuthManager";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../interfaces/IUserRepository";
import { AccessTokenManager } from "../../infrastructure/security/AccessTokenManager";
import { User } from "../../domain/entities/UserEntity";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";

export class GoogleOAuth {
  constructor(
    private readonly googleOAuthManager: GoogleOAuthManager,
    private readonly userRepo: IUserRepository,
    private readonly accessTokenManger: AccessTokenManager
  ) {}

  async execute(code: string) {
    try {
      const { id_token } = await this.googleOAuthManager.getGoogleToken(code);

      const { email, name, picture } = jwt.decode(id_token) as {
        name: string;
        email: string;
        picture: string;
      };

      const user = await this.userRepo.findUserByEmail(email);

      if (user) {
        const accessToken = this.accessTokenManger.generate({
          email,
          userId: user.userId,
          username: user.username,
        });
        return accessToken;
      }

      const username = await this.generateUniqueUsername(name);
      const dummyPassword = await bcrypt.hash(
        randomBytes(8).toString("hex"),
        10
      );

      const newUser = await this.userRepo.save(
        new User({
          username,
          password: dummyPassword,
          email,
          userId: "",
          profile: picture,
        })
      );

      const accessToken = this.accessTokenManger.generate({
        email,
        username,
        userId: newUser.userId,
      });

      return accessToken;
    } catch (err) {
      throw Object.assign(new Error("Google user authorization failed"), {
        statusCode: 400,
      });
    }
  }

  async generateUniqueUsername(username: string): Promise<string> {
    const user = await this.userRepo.findUserByUsername(username);
    if (!user) return username;
    const sufix = randomBytes(5).toString("hex");
    return await this.generateUniqueUsername(username + sufix);
  }
}
