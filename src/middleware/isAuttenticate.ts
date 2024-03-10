import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authorization = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) throw { status: 401, message: "Token is required" };

  const listString = bearerToken.split(" ");
  const token = listString[1];

  const secret = process.env.KEY_JWT;
  const decoded = jwt.verify(token, secret);

  if (!decoded) throw { status: 401, message: "Unauthorized access" };

  res.locals.userId = decoded.sub;
  next();
};

export default authorization;
