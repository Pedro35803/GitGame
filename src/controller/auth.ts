import { Request, Response } from "express";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { JWT_SECRET } from "../env";
import { db } from "../db";

export const register = async (req: Request, res: Response) => {
  const { password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const data: User = {
    ...req.body,
    password: hashPassword,
  };
  const user: Partial<User> = await db.user.create({
    data,
    select: { password: false },
  });
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const objError = { status: 401, message: "user or password incorrect" };

  const user: User = await db.user.findUnique({ where: { email } });
  if (!user) throw objError;

  const isPasswordEqual = await bcrypt.compare(password, user.password);
  if (!isPasswordEqual) throw objError;

  const token = jwt.sign(user.id, JWT_SECRET, { algorithm: "HS256" });

  res.status(201).json({ token });
};
