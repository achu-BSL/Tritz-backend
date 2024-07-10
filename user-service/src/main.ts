import { Server } from "./presentation/Server";
import dotenv from "dotenv";
dotenv.config();

const main = async () => {
  const port = process.env.PORT ? +process.env.PORT : 3001;

  Server.run({ port });
};

main();
