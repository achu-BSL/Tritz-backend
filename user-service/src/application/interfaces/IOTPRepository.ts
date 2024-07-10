import { IOTPEntity } from "./IOTPEntity";

export interface IOTPRepository {
  save: (otp: IOTPEntity) => Promise<void>;
  findByEmail: (email: string) => Promise<IOTPEntity | null>;
}
