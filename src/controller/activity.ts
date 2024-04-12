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
    message: "Access denied. Protecting activity privacy.",
  };

  if (!privilegies.canManageContentGame) throw objError;
  next();
};

export const create = async (req: Request, res: Response) => {
  const activity = await db.activity.create({ data: req.body });
  res.status(201).json(activity);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activity = await db.activity.findUniqueOrThrow({ where: { id } });
  res.json(activity);
};

export const getAll = async (req: Request, res: Response) => {
  const activity = await db.activity.findMany({ where: req.query });
  res.json(activity);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.activity.findUniqueOrThrow({ where });

  const activity = await db.activity.update({ data: req.body, where });
  res.status(203).json(activity);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activity = await db.activity.delete({ where: { id } });
  res.status(204).json(activity);
};
