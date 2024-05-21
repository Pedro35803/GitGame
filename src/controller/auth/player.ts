import { NextFunction, Request, Response } from "express";
import { Privilegies } from "@prisma/client";
import bcrypt from "bcrypt";

import { db } from "../../db";

const select = { email: true, name: true, password: false, user: true };

export const handleAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id_user } = req.params;
  const { userId, method } = req;

  const objError = {
    status: 401,
    message: "Access denied. Protecting user privacy.",
  };

  if (userId === id_user) return next();

  const admin = await db.admin.findUnique({
    where: { id_userLogged: userId },
    include: { privilegies: true },
  });

  if (!admin) throw objError;
  const privilegies: Privilegies = admin.privilegies;

  if (!privilegies.canManageCRUDPlayer) throw objError;
  if (method === "GET" && !id_user && !privilegies.canManageCRUDPlayer)
    throw objError;

  next();
};

export const create = async (req: Request, res: Response) => {
  const user = await db.userLogged.create({
    data: req.body,
    select,
  });
  res.status(201).json(user);
};

export const getById = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const user = await db.userLogged.findUniqueOrThrow({
    where: { id_user },
    select,
  });
  res.json(user);
};

export const getAll = async (req: Request, res: Response) => {
  const user = await db.userLogged.findMany({ where: req.query, select });
  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { id_user } = req.params;
  const where = { id_user };

  const update = {
    ...req.body,
    password: password ? await bcrypt.hash(password, 10) : undefined,
  };

  await db.userLogged.findUniqueOrThrow({ where });

  const user = await db.userLogged.update({ data: update, where, select });
  res.status(203).json(user);
};

export const destroy = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const user = await db.user.delete({ where: { id: id_user } });
  res.status(204).json(user);
};
