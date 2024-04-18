import { Privilegies } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      userId: string
      privilegies: Privilegies;
      file: {
        filename: string
      }
    }
 }
}

export {};
