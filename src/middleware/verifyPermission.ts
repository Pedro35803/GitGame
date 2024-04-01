import { NextFunction, Request, Response } from "express";
import { db } from "../db";

export const verifyPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id_user = req.userId;
  const user = await db.admin.findUnique({
    where: { id_user },
    select: { id_user: true, Privilegies: true },
  });

  if (!user)
    throw {
      status: 401,
      message: "Router protect, necessity admin privileges",
    };

  req.privilegies = user.Privilegies;
  next();
};