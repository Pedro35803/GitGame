import { NextFunction, Request, Response } from "express";
import { Capter, Privilegies } from "@prisma/client";
import { db } from "../../db";

const getInclude = (id_user: string) => ({
  level: true,
  capterProgress: { where: { id_user } },
});

export const handleAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const privilegies: Privilegies = req.privilegies;

  const objError = {
    status: 401,
    message: "Access denied. Protecting capter privacy.",
  };

  if (!privilegies.canManageContentGame) throw objError;
  next();
};

export const create = async (req: Request, res: Response) => {
  const userId = req.userId;
  const include = getInclude(userId);
  const capter = await db.capter.create({ data: req.body, include });
  res.status(201).json(capter);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const include = getInclude(userId);
  const capter = await db.capter.findUniqueOrThrow({
    where: { id },
    include,
  });
  res.json(capter);
};

export const getAll = async (req: Request, res: Response) => {
  const { numberOrder } = req.query;
  const userId = req.userId;
  const include = getInclude(userId);
  const filter: Partial<Capter> = {
    ...req.query,
    numberOrder: numberOrder && Number(numberOrder),
  };
  const capter = await db.capter.findMany({ where: filter, include });
  res.json(capter);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };
  const userId = req.userId;
  const include = getInclude(userId);

  await db.capter.findUniqueOrThrow({ where });

  const capter = await db.capter.update({ data: req.body, where, include });
  res.status(203).json(capter);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const capter = await db.capter.delete({ where: { id } });
  res.status(204).json(capter);
};
