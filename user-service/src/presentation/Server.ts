import express from "express";

import cors, { CorsOptions } from "cors";
import { GenerateOTPController } from "./controllers/GenerateOTPController";
import { ValidateOTPMiddleware } from "./middlewares/ValidateOTPMiddleware";
import { ValidateOTPController } from "./controllers/ValidateOTPController";

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
  }: {
    port: number;
    generateOTPController: GenerateOTPController;
    validateOTPMiddleware: ValidateOTPMiddleware;
    validateOTPController: ValidateOTPController;
  }) {
    app.use(cors(corsOptions));
    app.use(express.json(), express.urlencoded({ extended: true }));

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

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
