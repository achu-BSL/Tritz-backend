import express from "express";

import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { GenerateOTPController } from "./controllers/GenerateOTPController";
import { ValidateOTPMiddleware } from "./middlewares/ValidateOTPMiddleware";
import { ValidateOTPController } from "./controllers/ValidateOTPController";
import { LoginController } from "./controllers/LoginController";
import { GoogleOAuthController } from "./controllers/GoogleOAuthController";
import { GenerateResetPasswordOTPController } from "./controllers/GenerateResetPasswordOTPController";
import { ValidateResetPasswordOTPController } from "./controllers/ValidateResetPasswordOTPController";
import { ValidateResetPasswordOTPMiddleware } from "./middlewares/ValidateResetPasswordOTPMiddleware";
import { ResetPasswordMiddleware } from "./middlewares/ResetPasswordMiddleware";
import { ResetPasswordController } from "./controllers/ResetPasswordController";

const app = express();

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

export class Server {
  static run({
    port,
    generateOTPController,
    validateOTPMiddleware,
    validateOTPController,
    loginController,
    googleOAuthController,
    generateResetPasswordOTPController,
    validateResetPasswordOTPMiddleware,
    validateResetPasswordOTPController,
    resetPasswordMiddleware,
    resetPasswordController,
  }: {
    port: number;
    generateOTPController: GenerateOTPController;
    validateOTPMiddleware: ValidateOTPMiddleware;
    validateOTPController: ValidateOTPController;
    loginController: LoginController;
    googleOAuthController: GoogleOAuthController;
    generateResetPasswordOTPController: GenerateResetPasswordOTPController;
    validateResetPasswordOTPMiddleware: ValidateResetPasswordOTPMiddleware;
    validateResetPasswordOTPController: ValidateResetPasswordOTPController;
    resetPasswordMiddleware: ResetPasswordMiddleware;
    resetPasswordController: ResetPasswordController;
  }) {
    app.use(cors(corsOptions));
    app.use(express.json(), express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.get("/", (_req, res) => {
      res.send({ status: "Running", service: "User-service", port });
    });

    app.post("/otp/generate", (req, res) =>
      generateOTPController.handle(req, res)
    );

    app.post(
      "/otp/validate",
      (req, res, next) => validateOTPMiddleware.use(req, res, next),
      (req, res) => validateOTPController.handle(req, res)
    );

    app.post("/login", (req, res) => loginController.handle(req, res));

    app.post("/oauth/google", (req, res) =>
      googleOAuthController.handle(req, res)
    );

    app.post("/reset-password-otp/generate", (req, res) =>
      generateResetPasswordOTPController.handle(req, res)
    );

    app.post(
      "/reset-password-otp/validate",
      (req, res, next) => {
        validateResetPasswordOTPMiddleware.use(req, res, next);
      },
      (req, res) => {
        validateResetPasswordOTPController.handle(req, res);
      }
    );

    app.patch(
      "/reset-password",
      (req, res, next) => {
        resetPasswordMiddleware.use(req, res, next);
      },
      (req, res) => {
        resetPasswordController.handle(req, res);
      }
    );

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
