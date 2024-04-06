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
    message: "Access denied. Protecting capter privacy.",
  };

  if (!privilegies.canManageContentGame) throw objError;
  next();
};

export const create = async (req: Request, res: Response) => {
  const capter = await db.capter.create({ data: req.body });
  res.status(201).json(capter);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const capter = await db.capter.findUniqueOrThrow({ where: { id } });
  res.json(capter);
};

export const getAll = async (req: Request, res: Response) => {
  const capter = await db.capter.findMany();
  res.json(capter);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.capter.findUniqueOrThrow({ where });

  const capter = await db.capter.update({ data: req.body, where });
  res.status(203).json(capter);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const capter = await db.capter.delete({ where: { id } });
  res.status(204).json(capter);
};
