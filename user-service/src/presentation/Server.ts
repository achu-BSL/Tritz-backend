import express from "express";

import cors, { CorsOptions } from "cors";

const app = express();

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

export class Server {
  static run({ port }: { port: number }) {

    app.use(cors(corsOptions));
    app.use(express.json(), express.urlencoded({ extended: true }));

    app.get("/", (_req, res) => {
      res.send({ status: "Running", service: "User-service", port });
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
