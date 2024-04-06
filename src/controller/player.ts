import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { Player, Privilegies, User } from "@prisma/client";

const select = {
  id_user: true,
  complete_game_percentage: true,
  user: {
    select: {
      email: true,
      name: true,
    },
  },
};

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
    where: { id_user: userId },
    select: { id_user: true, Privilegies: true },
  });

  if (!admin) throw objError;
  const privilegies: Privilegies = admin.Privilegies;

  if (!privilegies.canManageCRUDPlayer) throw objError;
  if (method === "GET" && !id_user && !privilegies.canManageCRUDPlayer)
    throw objError;

  next();
};

export const create = async (req: Request, res: Response) => {
  const user = await db.player.create({
    data: req.body,
    select,
  });
  res.status(201).json(user);
};

export const getById = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const user = await db.player.findUniqueOrThrow({
    where: { id_user },
    select,
  });
  res.json(user);
};

export const getAll = async (req: Request, res: Response) => {
  const { complete_game_percentage: percent } = req.query;
  const filter: Partial<Player> = {
    ...req.query,
    complete_game_percentage: percent && Number(percent),
  };
  const user = await db.player.findMany({ select, where: filter });
  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const where = { id_user };

  await db.player.findUniqueOrThrow({ where });

  const user = await db.player.update({ data: req.body, where, select });
  res.status(203).json(user);
};

export const destroy = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const user = await db.player.delete({ where: { id_user } });
  res.status(204).json(user);
};
