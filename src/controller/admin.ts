import { Request, Response } from "express";
import { Privilegies } from "@prisma/client";
import bcrypt from "bcrypt";
import { db } from "../db";

const select = {
  id_user: true,
  user: {
    select: {
      email: true,
      name: true,
    },
  },
  Privilegies: true,
};

export const create = async (req: Request, res: Response) => {
  const privilegies: Privilegies = req.privilegies;

  if (!privilegies.canCreateAdmin)
    throw { status: 401, message: "Access denied. Insufficient privileges." };

  const { second_password } = req.body;

  const create = {
    ...req.body,
    second_password: second_password
      ? await bcrypt.hash(second_password, 10)
      : undefined,
  };

  const user = await db.admin.create({
    data: {
      ...create,
      Privilegies: {
        create: {},
      },
    },
    select,
  });

  res.status(201).json(user);
};

export const getAll = async (req: Request, res: Response) => {
  const privilegies: Privilegies = req.privilegies;
  const { id_user } = req.params;
  const userId = req.userId;

  if (userId !== id_user && !privilegies.canViewAllAdmin)
    throw { status: 401, message: "Access denied. Protecting user privacy." };

  const user = await db.admin.findMany({
    where: { id_user },
    select,
  });

  res.json(user);
};

export const getById = async (req: Request, res: Response) => {
  const privilegies: Privilegies = req.privilegies;
  const { id_user } = req.params;
  const userId = req.userId;

  if (userId !== id_user && !privilegies.canViewAllAdmin)
    throw { status: 401, message: "Access denied. Protecting user privacy." };

  const user = await db.admin.findUniqueOrThrow({
    where: { id_user },
    select,
  });

  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const privilegies: Privilegies = req.privilegies;
  const { id_user } = req.params;
  const userId = req.userId;
  const where = { id_user };

  if (userId !== id_user && !privilegies.canEditPrivilegiesAdmin)
    throw { status: 401, message: "Access denied. Protecting user privacy." };

  await db.admin.findUniqueOrThrow({ where });
  const { second_password } = req.body;

  const update = {
    second_password: second_password
      ? await bcrypt.hash(second_password, 10)
      : undefined,
  };

  const updatePrivilegies = req.body;
  delete updatePrivilegies["second_password"];
  delete updatePrivilegies["id_user"];

  const user = await db.admin.update({
    data: {
      ...update,
      Privilegies: {
        update: updatePrivilegies,
      },
    },
    where,
    select,
  });
  res.status(203).json(user);
};

export const destroy = async (req: Request, res: Response) => {
  const privilegies: Privilegies = req.privilegies;
  const { id_user } = req.params;
  const userId = req.userId;

  if (userId !== id_user && !privilegies.canDeleteAdmin)
    throw { status: 401, message: "Access denied. Insufficient privileges." };

  const user = await db.admin.delete({ where: { id_user } });
  res.status(204).json(user);
};
