import { Request, Response } from "express";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { JWT_SECRET } from "../../env";
import { db } from "../../db";

export const register = async (req: Request, res: Response) => {
  const { password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const data: User = {
    ...req.body,
    type: "logged",
    password: hashPassword,
  };
  const user: Partial<User> = await db.user.create({ data });
  res.status(201).json({ ...user, password: undefined });
};

export const registerAnonymous = async (req: Request, res: Response) => {
  const user: Partial<User> = await db.user.create({
    data: { type: "anonymous" },
    select: { id: true, picture: true, type: true },
  });
  const token = jwt.sign({ sub: user.id, type: user.type }, JWT_SECRET, {
    algorithm: "HS256",
  });
  res.status(201).json({ ...user, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const objError = { status: 401, message: "email or password incorrect" };

  const user = await db.user.findUnique({
    where: { email },
    include: { Admin: true },
  });
  if (!user) throw objError;

  const isPasswordEqual = await bcrypt.compare(password, user.password);
  if (!isPasswordEqual) throw objError;

  const token = jwt.sign({ sub: user.id, type: user.type }, JWT_SECRET, {
    algorithm: "HS256",
  });

  if (user.Admin) {
    const { second_password } = req.body;

    if (!second_password) {
      throw {
        status: 201,
        message: "For Admin login is necessary field second_password",
      };
    }

    const isSecondPassEqual = await bcrypt.compare(
      second_password,
      user.Admin.second_password
    );

    if (!isSecondPassEqual) throw objError;
  }

  res.status(201).json({ token });
};
