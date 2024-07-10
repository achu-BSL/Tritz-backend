import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../database/setup"

export const init = async () => {
    connectDB();
}