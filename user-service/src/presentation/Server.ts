import express from "express";

import cors, { CorsOptions } from "cors";
import { GenerateOTPController } from "./controllers/generateOTPController";

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
  }: {
    port: number;
    generateOTPController: GenerateOTPController;
  }) {
    app.use(cors(corsOptions));
    app.use(express.json(), express.urlencoded({ extended: true }));

    app.get("/", (_req, res) => {
      res.send({ status: "Running", service: "User-service", port });
    });

    app.post("/otp/generate", (req, res) =>
      generateOTPController.handle(req, res)
    );

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
