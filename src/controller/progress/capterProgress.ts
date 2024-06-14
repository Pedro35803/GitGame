import { NextFunction, Request, Response } from "express";
import {
  ContentProgress,
  Privilegies,
  ContentProgressWhereInput,
} from "@prisma/client";
import { db } from "../../db";
import { unauthorizedError } from "../../services/objError";

const include = { user: true, capter: true };

export const handleAccessUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { userId, method } = req;

  if (req.adminAccess) return next();

  const progress = await db.capterProgress.findFirst({
    where: { id },
    include,
  });

  if (userId === progress?.user.id) return next();
  if (method === "POST" && userId === req.body?.id_user) return next();

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
  const capterProgress = await db.capterProgress.create({
    data: req.body,
    include,
  });
  res.status(201).json(capterProgress);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const capterProgress = await db.capterProgress.findUniqueOrThrow({
    where: { id },
    include,
  });
  res.json(capterProgress);
};

export const getAll = async (req: Request, res: Response) => {
  const { id_user } = req.query;

  const capterProgress = await db.capterProgress.findMany({
    where: { ...req.query, id_user },
    include,
  });

  res.json(capterProgress);
};

export const getAllUser = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit);
  const { userId } = req;

  const filter = {
    ...req.query,
    id_user: userId,
    limit: undefined,
  };

  const capterProgress = await db.capterProgress.findMany({
    where: filter,
    include,
    take: limit || 1000,
  });

  const response = limit == 1 ? capterProgress[0] : capterProgress;

  res.json(response);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.capterProgress.findUniqueOrThrow({ where });

  const capterProgress = await db.capterProgress.update({
    data: req.body,
    where,
    include,
  });

  res.status(203).json(capterProgress);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const capterProgress = await db.capterProgress.delete({ where: { id } });
  res.status(204).json(capterProgress);
};
