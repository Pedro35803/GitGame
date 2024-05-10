import { NextFunction, Request, Response } from "express";
import { Privilegies } from "@prisma/client";
import { db } from "../../db";

const include = { player: true, capter: true };

export const handleAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId, method } = req;

  const objError = {
    status: 401,
    message: "Access denied. Protecting user privacy.",
  };

  const progress = await db.playerProgress.findFirst({
    where: { id },
    include,
  });

  if (userId === progress?.player.id_user) return next();
  if (method === "POST" && userId === req.body?.id_player) return next();

  const admin = await db.admin.findUnique({
    where: { id_user: userId },
    select: { id_user: true, Privilegies: true },
  });

  if (!admin) throw objError;
  const privilegies: Privilegies = admin.Privilegies;

  if (!privilegies.canManageCRUDPlayer) throw objError;

  next();
};

export const create = async (req: Request, res: Response) => {
  const playerProgress = await db.playerProgress.create({ data: req.body, includer });
  res.status(201).json(playerProgress);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const playerProgress = await db.playerProgress.findUniqueOrThrow({
    where: { id },
    include
  });
  res.json(playerProgress);
};

export const getAll = async (req: Request, res: Response) => {
  const playerProgress = await db.playerProgress.findMany({ where: req.query, include });
  res.json(playerProgress);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.playerProgress.findUniqueOrThrow({ where });

  const playerProgress = await db.playerProgress.update({
    data: req.body,
    where,
    include
  });
  res.status(203).json(playerProgress);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const playerProgress = await db.playerProgress.delete({ where: { id } });
  res.status(204).json(playerProgress);
};
