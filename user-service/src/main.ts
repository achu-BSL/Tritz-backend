import { init } from "./infrastructure/config/bootstrp";
import { Server } from "./presentation/Server";

const main = async () => {
  await init();
  const port = process.env.PORT ? +process.env.PORT : 3001;

  Server.run({ port });
};

main();
