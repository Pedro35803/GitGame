import { NextFunction, Request, Response } from "express";
import { Privilegies } from "@prisma/client";
import { db } from "../db";

export const handleAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const privilegies: Privilegies = req.privilegies;

  const objError = {
    status: 401,
    message: "Access denied. Protecting level privacy.",
  };

  if (!privilegies.canManageContentGame) throw objError;
  next();
};

export const create = async (req: Request, res: Response) => {
  const level = await db.level.create({ data: req.body });
  res.status(201).json(level);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const level = await db.level.findUniqueOrThrow({ where: { id } });
  res.json(level);
};

export const getAll = async (req: Request, res: Response) => {
  const level = await db.level.findMany();
  res.json(level);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.level.findUniqueOrThrow({ where });

  const level = await db.level.update({ data: req.body, where });
  res.status(203).json(level);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const level = await db.level.delete({ where: { id } });
  res.status(204).json(level);
};
