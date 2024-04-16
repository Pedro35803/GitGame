import { NextFunction, Request, Response } from "express";
import { Privilegies, Subject } from "@prisma/client";
import { db } from "../../db";

export const handleAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const privilegies: Privilegies = req.privilegies;

  const objError = {
    status: 401,
    message: "Access denied. Protecting subject privacy.",
  };

  if (!privilegies.canManageContentGame) throw objError;
  next();
};

export const create = async (req: Request, res: Response) => {
  const subject = await db.subject.create({ data: req.body });
  res.status(201).json(subject);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const subject = await db.subject.findUniqueOrThrow({ where: { id } });
  res.json(subject);
};

export const getAll = async (req: Request, res: Response) => {
  const filter: Partial<Subject> = {
    ...req.query,
    text: undefined,
  };
  const subject = await db.subject.findMany({ where: filter });
  res.json(subject);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id };

  await db.subject.findUniqueOrThrow({ where });

  const subject = await db.subject.update({ data: req.body, where });
  res.status(203).json(subject);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const subject = await db.subject.delete({ where: { id } });
  res.status(204).json(subject);
};
