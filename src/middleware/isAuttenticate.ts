import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../env";

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) throw { status: 401, message: "Token is required" };

  const listString = bearerToken.split(" ");
  const token = listString[1];

  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded) throw { status: 401, message: "Unauthorized access" };

  req.userId = decoded as string;
  next();
};

export default authorization;
