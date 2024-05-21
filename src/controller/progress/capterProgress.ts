import { NextFunction, Request, Response } from "express";
import { Privilegies } from "@prisma/client";
import { db } from "../../db";

const include = { level: true, playerProgress: true };

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

  const progress = await db.capterProgress.findFirst({
    where: { id },
    include,
  });

  if (userId === progress?.playerProgress.id_user) return next();
  if (method === "POST") {
    const progressPlayer = await db.playerProgress.findFirst({
      where: { id: req.body?.id_userProgress },
    });
    if (progressPlayer.id_user === userId) return next();
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
  const capterProgress = await db.capterProgress.create({ data: req.body });
  res.status(201).json(capterProgress);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const capterProgress = await db.capterProgress.findUniqueOrThrow({
    where: { id },
  });
  res.json(capterProgress);
};

export const getAll = async (req: Request, res: Response) => {
  const capterProgress = await db.capterProgress.findMany({ where: req.query });
  res.json(capterProgress);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.capterProgress.findUniqueOrThrow({ where });

  const capterProgress = await db.capterProgress.update({
    data: req.body,
    where,
  });
  res.status(203).json(capterProgress);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const capterProgress = await db.capterProgress.delete({ where: { id } });
  res.status(204).json(capterProgress);
};
