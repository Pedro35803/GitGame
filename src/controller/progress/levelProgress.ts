import { NextFunction, Request, Response } from "express";
import { CapterProgress, LevelProgress, Privilegies } from "@prisma/client";
import { db } from "../../db";

const include = { level: true, capterProgress: true };

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
    include,
  });

  if (userId === progress?.capterProgress.id_user) return next();
  if (method === "POST") {
    const progressPlayer = await db.capterProgress.findFirst({
      where: { id: req.body?.id_capter_progress },
    });
    if (!progressPlayer || progressPlayer.id_user === userId) return next();
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
  const { id_capter_progress, id_level } = req.body;
  const id_user = req.userId;

  const level = await db.level.findUnique({
    where: { id: id_level },
    include: { capter: true },
  });

  const id_capter = level.capter.id;

  const levelProgress = await db.levelProgress.create({
    data: {
      capterProgress: {
        connectOrCreate: {
          create: {
            id_capter,
            id_user,
          },
          where: {
            id: id_capter_progress,
          },
        },
      },
      level: {
        connect: {
          id: id_level,
        },
      },
    },
  });

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
