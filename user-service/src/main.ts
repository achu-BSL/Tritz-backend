import { GenerateOTP } from "./application/use-cases/GenerateOTP";
import { init } from "./infrastructure/config/bootstrp";
import { OTPRepository } from "./infrastructure/repositories/OTPRepository";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { RegisterTokenManager } from "./infrastructure/security/RegisterTokenManager";
import { GenerateOTPController } from "./presentation/controllers/generateOTPController";
import { Server } from "./presentation/Server";

const main = async () => {
  await init();
  const port = process.env.PORT ? +process.env.PORT : 3001;

  const userRepo = new UserRepository();
  const otpRepo = new OTPRepository();

  const registerTokenManager = new RegisterTokenManager();
  
  const generateOTP = new GenerateOTP(userRepo, otpRepo, registerTokenManager);

  const generateOTPController = new GenerateOTPController(generateOTP);

  Server.run({ port, generateOTPController });
};

main();
