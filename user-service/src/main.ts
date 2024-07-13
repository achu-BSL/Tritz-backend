import { GenerateOTP } from "./application/use-cases/GenerateOTP";
import { GoogleOAuth } from "./application/use-cases/GoogleOAuth";
import { Login } from "./application/use-cases/Login";
import { ValidateOTP } from "./application/use-cases/ValidateOTP";
import { init } from "./infrastructure/config/bootstrp";
import { OTPRepository } from "./infrastructure/repositories/OTPRepository";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { AccessTokenManager } from "./infrastructure/security/AccessTokenManager";
import { GoogleOAuthManager } from "./infrastructure/security/GoogleOAuthManager";
import { RegisterTokenManager } from "./infrastructure/security/RegisterTokenManager";
import { MailService } from "./infrastructure/services/MailService";
import { GenerateOTPController } from "./presentation/controllers/GenerateOTPController";
import { GoogleOAuthController } from "./presentation/controllers/GoogleOAuthController";
import { LoginController } from "./presentation/controllers/LoginController";
import { ValidateOTPController } from "./presentation/controllers/ValidateOTPController";
import { ValidateOTPMiddleware } from "./presentation/middlewares/ValidateOTPMiddleware";
import { Server } from "./presentation/Server";

const main = async () => {
  await init();
  const port = process.env.PORT ? +process.env.PORT : 3001;

  const userRepo = new UserRepository();
  const otpRepo = new OTPRepository();

  const registerTokenManager = new RegisterTokenManager();
  const accessTokenManager = new AccessTokenManager();
  const googleOAuthManager = new GoogleOAuthManager();

  const mailService = new MailService();

  const generateOTP = new GenerateOTP(
    userRepo,
    otpRepo,
    registerTokenManager,
    mailService
  );
  const validateOTP = new ValidateOTP(otpRepo, userRepo, accessTokenManager);
  const login = new Login(userRepo, accessTokenManager);
  const googleOAuth = new GoogleOAuth(googleOAuthManager, userRepo, accessTokenManager);

  const validateOTPMiddleware = new ValidateOTPMiddleware(registerTokenManager);

  const generateOTPController = new GenerateOTPController(generateOTP);
  const validateOTPController = new ValidateOTPController(validateOTP);
  const loginController = new LoginController(login);
  const googleOAuthController = new GoogleOAuthController(googleOAuth);

  Server.run({
    port,
    generateOTPController,
    validateOTPMiddleware,
    validateOTPController,
    loginController,
    googleOAuthController
  });
};

main();
