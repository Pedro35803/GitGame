import { NextFunction, Request, Response } from "express";
import { Privilegies, LevelProgressWhereInput } from "@prisma/client";
import { unauthorizedError } from "../../services/objError";
import { db } from "../../db";

const include = { level: true, capterProgress: true, contentProgress: true };

export const handleAccessUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId, method } = req;

  const progress = await db.levelProgress.findFirst({
    where: { id },
    include,
  });

  if (req.adminAccess) return next();

  if (userId === progress?.capterProgress.id_user) return next();
  if (method === "POST") {
    const capterProgress = await db.capterProgress.findFirst({
      where: { id: req.body?.id_capter_progress },
    });
    if (!capterProgress || capterProgress.id_user === userId) return next();
  }

  throw unauthorizedError;
};

export const handleAccessAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const admin = await db.admin.findUnique({
    where: { id_userLogged: userId },
    select: { id_userLogged: true, privilegies: true },
  });

  if (!admin) return next();
  const privilegies: Privilegies = admin.privilegies;

  if (!privilegies.canManageCRUDPlayer) throw unauthorizedError;

  req.adminAccess = true;
  next();
};

export const create = async (req: Request, res: Response) => {
  const { id, id_capter_progress, id_level, complete } = req.body;
  const id_user = req.userId;

  const level = await db.level.findUnique({
    where: { id: id_level },
    include: { capter: true },
  });

  const id_capter = level.capter.id;

  const levelProgress = await db.levelProgress.create({
    data: {
      id,
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
    include,
  });
  res.json(levelProgress);
};

export const getAll = async (req: Request, res: Response) => {
  const { id_user } = req.query;

  const objFilterUser = id_user ? { capterProgress: { id_user } } : {};
  const filter: Partial<LevelProgressWhereInput> = {
    ...req.query,
    ...objFilterUser,
    id_user: undefined,
  };

  const levelProgress = await db.levelProgress.findMany({
    where: filter,
    include,
  });

  res.json(levelProgress);
};

export const getAllUser = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit);
  const { userId } = req;

  const filter = {
    ...req.query,
    capterProgress: { id_user: userId },
    limit: undefined,
  };

  const levelProgress = await db.levelProgress.findMany({
    where: filter,
    include,
    take: limit || 1000,
  });

  const response = limit == 1 ? levelProgress[0] : levelProgress;

  res.json(response);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.levelProgress.findUniqueOrThrow({ where });

  const levelProgress = await db.levelProgress.update({
    data: req.body,
    where,
    include,
  });
  res.status(203).json(levelProgress);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const levelProgress = await db.levelProgress.delete({ where: { id } });
  res.status(204).json(levelProgress);
};
