import { Privilegies, TypeUser } from "@prisma/client";

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
