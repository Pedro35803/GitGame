import { Privilegies } from "@prisma/client";
import { TypeUser } from "../typeUser";

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      typeUser: TypeUser;
      privilegies: Privilegies;
      file: {
        filename: string;
      }
    }
 }
}

export {};
