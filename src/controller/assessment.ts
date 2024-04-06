import { NextFunction, Request, Response } from "express";
import { Assessment, Privilegies } from "@prisma/client";
import { db } from "../db";

export const handleAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const privilegies: Privilegies = req.privilegies;

  const objError = {
    status: 401,
    message: "Access denied. Protecting assessment privacy.",
  };

  if (!privilegies.canManageContentGame) throw objError;
  next();
};

export const create = async (req: Request, res: Response) => {
  const assessment = await db.assessment.create({ data: req.body });
  res.status(201).json(assessment);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const assessment = await db.assessment.findUniqueOrThrow({ where: { id } });
  res.json(assessment);
};

export const getAll = async (req: Request, res: Response) => {
  const filter: Partial<Assessment> = {
    ...req.query,
    description: undefined,
  };
  const assessment = await db.assessment.findMany({ where: filter });
  res.json(assessment);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.assessment.findUniqueOrThrow({ where });

  const assessment = await db.assessment.update({ data: req.body, where });
  res.status(203).json(assessment);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const assessment = await db.assessment.delete({ where: { id } });
  res.status(204).json(assessment);
};
