import { NextFunction, Request, Response } from "express";
import { Privilegies, Objective } from "@prisma/client";
import { db } from "../../db";

export const handleAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const privilegies: Privilegies = req.privilegies;

  const objError = {
    status: 401,
    message: "Access denied. Protecting objective privacy.",
  };

  if (!privilegies.canManageContentGame) throw objError;
  next();
};

export const create = async (req: Request, res: Response) => {
  const objective = await db.objective.create({ data: req.body });
  res.status(201).json(objective);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const objective = await db.objective.findUniqueOrThrow({ where: { id } });
  res.json(objective);
};

export const getAll = async (req: Request, res: Response) => {
  const filter: Partial<Objective> = {
    ...req.query,
    resolution: undefined,
    objective: undefined,
  };
  const objective = await db.objective.findMany({ where: filter });
  res.json(objective);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.objective.findUniqueOrThrow({ where });

  const objective = await db.objective.update({ data: req.body, where });
  res.status(203).json(objective);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const objective = await db.objective.delete({ where: { id } });
  res.status(204).json(objective);
};
