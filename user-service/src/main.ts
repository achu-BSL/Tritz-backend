import { GenerateOTP } from "./application/use-cases/GenerateOTP";
import { ValidateOTP } from "./application/use-cases/ValidateOTP";
import { init } from "./infrastructure/config/bootstrp";
import { OTPRepository } from "./infrastructure/repositories/OTPRepository";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { AccessTokenManager } from "./infrastructure/security/AccessTokenManager";
import { RegisterTokenManager } from "./infrastructure/security/RegisterTokenManager";
import { MailService } from "./infrastructure/services/MailService";
import { GenerateOTPController } from "./presentation/controllers/GenerateOTPController";
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

  const mailService = new MailService();

  const generateOTP = new GenerateOTP(userRepo, otpRepo, registerTokenManager, mailService

  );
  const validateOTP = new ValidateOTP(
    otpRepo,
    userRepo,
    accessTokenManager
  );

  const validateOTPMiddleware = new ValidateOTPMiddleware(registerTokenManager);

  const generateOTPController = new GenerateOTPController(generateOTP);
  const validateOTPController = new ValidateOTPController(validateOTP);
  

  Server.run({ port, generateOTPController, validateOTPMiddleware, validateOTPController });
};

main();
