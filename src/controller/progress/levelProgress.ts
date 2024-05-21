import { NextFunction, Request, Response } from "express";
import { Privilegies } from "@prisma/client";
import { db } from "../../db";

const include = { orderLevel: true, capterProgress: true };

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

  const progress = await db.levelProgress.findFirst({
    where: { id },
    include: {
      ...include,
      capterProgress: { include: { playerProgress: true } },
    },
  });

  if (userId === progress?.capterProgress.playerProgress.id_user)
    return next();
  if (method === "POST") {
    const progressCapter = await db.capterProgress.findFirst({
      where: { id: req.body?.id_capterProgress },
      include: { playerProgress: true },
    });
    if (progressCapter?.playerProgress.id_user === userId) return next();
  }

  const admin = await db.admin.findUnique({
    where: { id_userLogged: userId },
    select: { id_userLogged: true, privilegies: true },
  });

  if (!admin) throw objError;
  const privilegies: Privilegies = admin.privilegies;

  if (!privilegies.canManageCRUDPlayer) throw objError;

  next();
};

export const create = async (req: Request, res: Response) => {
  const levelProgress = await db.levelProgress.create({ data: req.body });
  res.status(201).json(levelProgress);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const levelProgress = await db.levelProgress.findUniqueOrThrow({
    where: { id },
  });
  res.json(levelProgress);
};

export const getAll = async (req: Request, res: Response) => {
  const levelProgress = await db.levelProgress.findMany({ where: req.query });
  res.json(levelProgress);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.levelProgress.findUniqueOrThrow({ where });

  const levelProgress = await db.levelProgress.update({
    data: req.body,
    where,
  });
  res.status(203).json(levelProgress);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const levelProgress = await db.levelProgress.delete({ where: { id } });
  res.status(204).json(levelProgress);
};
