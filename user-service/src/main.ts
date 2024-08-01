import { GenerateOTP } from "./application/use-cases/GenerateOTP";
import { GenerateResetPasswordOTP } from "./application/use-cases/GenerateResetPasswordOTP";
import { GoogleOAuth } from "./application/use-cases/GoogleOAuth";
import { Login } from "./application/use-cases/Login";
import { ResetPassword } from "./application/use-cases/ResetPassword";
import { ValidateOTP } from "./application/use-cases/ValidateOTP";
import { ValidateResetPasswordOTP } from "./application/use-cases/ValidateResetPasswordOTP";
import { init } from "./infrastructure/config/bootstrp";
import { OTPRepository } from "./infrastructure/repositories/OTPRepository";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { AccessTokenManager } from "./infrastructure/security/AccessTokenManager";
import { GoogleOAuthManager } from "./infrastructure/security/GoogleOAuthManager";
import { OTPManager } from "./infrastructure/security/OTPManger";
import { RegisterTokenManager } from "./infrastructure/security/RegisterTokenManager";
import { ResetPasswordOTPTokenManager } from "./infrastructure/security/ResetPasswordOTPTokenManager";
import { ResetPasswordTokenManager } from "./infrastructure/security/ResetPasswordTokenManager";
import { MailService } from "./infrastructure/services/MailService";
import { GenerateOTPController } from "./presentation/controllers/GenerateOTPController";
import { GenerateResetPasswordOTPController } from "./presentation/controllers/GenerateResetPasswordOTPController";
import { GoogleOAuthController } from "./presentation/controllers/GoogleOAuthController";
import { LoginController } from "./presentation/controllers/LoginController";
import { ResetPasswordController } from "./presentation/controllers/ResetPasswordController";
import { ValidateOTPController } from "./presentation/controllers/ValidateOTPController";
import { ValidateResetPasswordOTPController } from "./presentation/controllers/ValidateResetPasswordOTPController";
import { ResetPasswordMiddleware } from "./presentation/middlewares/ResetPasswordMiddleware";
import { ValidateOTPMiddleware } from "./presentation/middlewares/ValidateOTPMiddleware";
import { ValidateResetPasswordOTPMiddleware } from "./presentation/middlewares/ValidateResetPasswordOTPMiddleware";
import { Server } from "./presentation/Server";

const main = async () => {
  await init();
  const port = process.env.PORT ? +process.env.PORT : 3001;

  const userRepo = new UserRepository();
  const otpRepo = new OTPRepository();
  const mailService = new MailService();

  // managers
  const registerTokenManager = new RegisterTokenManager();
  const accessTokenManager = new AccessTokenManager();
  const googleOAuthManager = new GoogleOAuthManager();
  const otpManager = new OTPManager(otpRepo, mailService);
  const generateOTP = new GenerateOTP(
    userRepo,
    otpManager,
    registerTokenManager
  );
  const resetPasswordOTPTokenManager = new ResetPasswordOTPTokenManager();
  const resetPasswordTokenManager = new ResetPasswordTokenManager();

  // use cases
  const validateOTP = new ValidateOTP(otpManager, userRepo, accessTokenManager);
  const login = new Login(userRepo, accessTokenManager);
  const googleOAuth = new GoogleOAuth(
    googleOAuthManager,
    userRepo,
    accessTokenManager
  );
  const generateResetPasswordOTP = new GenerateResetPasswordOTP(
    userRepo,
    otpManager,
    resetPasswordOTPTokenManager
  );
  const validateResetPasswordOTP = new ValidateResetPasswordOTP(
    otpManager,
    resetPasswordTokenManager
  );
  const resetPassword = new ResetPassword(userRepo);

  // middlewares
  const validateOTPMiddleware = new ValidateOTPMiddleware(registerTokenManager);
  const validateResetPasswordOTPMiddleware =
    new ValidateResetPasswordOTPMiddleware(resetPasswordOTPTokenManager);
  const resetPasswordMiddleware = new ResetPasswordMiddleware(
    resetPasswordTokenManager
  );

  //controllers
  const generateOTPController = new GenerateOTPController(generateOTP);
  const validateOTPController = new ValidateOTPController(validateOTP);
  const loginController = new LoginController(login);
  const googleOAuthController = new GoogleOAuthController(googleOAuth);
  const generateResetPasswordOTPController =
    new GenerateResetPasswordOTPController(generateResetPasswordOTP);
  const validateResetPasswordOTPController =
    new ValidateResetPasswordOTPController(validateResetPasswordOTP);
  const resetPasswordController = new ResetPasswordController(resetPassword);

  Server.run({
    port,
    generateOTPController,
    validateOTPMiddleware,
    validateOTPController,
    loginController,
    googleOAuthController,
    generateResetPasswordOTPController,
    validateResetPasswordOTPController,
    validateResetPasswordOTPMiddleware,
    resetPasswordMiddleware,
    resetPasswordController,
  });
};

main();
