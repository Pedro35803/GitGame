import { Request, Response } from "express";
import { User, UserLogged } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { JWT_SECRET } from "../../env";
import { db } from "../../db";

export const register = async (req: Request, res: Response) => {
  const { password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const data: UserLogged = {
    ...req.body,
    password: hashPassword,
  };
  const user = await db.user.create({
    data: { userLogged: { create: { ...data } } },
    include: { userLogged: { select: { email: true, name: true } } },
  });
  res.status(201).json({ ...user, ...user.userLogged, userLogged: undefined });
};

export const registerAnonymous = async (req: Request, res: Response) => {
  const user: Partial<User> = await db.user.create({
    data: { anonymous: { create: {} } },
  });
  const token = jwt.sign({ sub: user.id, type: "anonymous" }, JWT_SECRET, {
    algorithm: "HS256",
  });
  res.status(201).json({ ...user, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const objError = { status: 401, message: "email or password incorrect" };

  const userLogged = await db.userLogged.findUnique({
    where: { email },
    include: { admin: true },
  });
  if (!userLogged) throw objError;

  const isPasswordEqual = await bcrypt.compare(password, userLogged.password);
  if (!isPasswordEqual) throw objError;

  const token = jwt.sign(
    { sub: userLogged.id_user, type: "logged" },
    JWT_SECRET,
    {
      algorithm: "HS256",
    }
  );

  if (userLogged.admin) {
    const { second_password } = req.body;

    if (!second_password) {
      throw {
        status: 201,
        message: "For Admin login is necessary field second_password",
      };
    }

    const isSecondPassEqual = await bcrypt.compare(
      second_password,
      userLogged.admin.second_password
    );

    if (!isSecondPassEqual) throw objError;
  }

  res.status(201).json({ token });
};
