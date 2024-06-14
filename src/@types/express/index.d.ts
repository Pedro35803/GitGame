import { Privilegies } from "@prisma/client";
import { TypeUser } from "../enums";

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      adminAccess: boolean;
      typeUser: TypeUser;
      privilegies: Privilegies;
      file: {
        filename: string;
      };
    }
  }
}

export {};
