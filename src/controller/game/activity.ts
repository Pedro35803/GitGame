import { NextFunction, Request, Response } from "express";
import { Privilegies } from "@prisma/client";
import { db } from "../../db";

const select = {
  id_assessment: true,
  id_orderLevel: true,
  assessment: true,
  orderLevel: true,
};

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
  const { id_level, title, order } = req.body;
  const orderNumber =
    order || (await db.orderLevel.count({ where: { id_level } })) + 1;

  const activity = await db.activity.create({
    data: {
      assessment: {
        create: { title },
      },
      orderLevel: {
        create: { id_level, order: orderNumber },
      },
    },
    select,
  });

  res.status(201).json(activity);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activity = await db.activity.findUniqueOrThrow({
    where: { id_assessment: id },
    select,
  });
  res.json(activity);
};

export const getAll = async (req: Request, res: Response) => {
  const activity = await db.activity.findMany({ where: req.query, select });
  res.json(activity);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const where = { id_assessment: id };

  await db.activity.findUniqueOrThrow({ where });

  const activity = await db.activity.update({ data: req.body, where, select });
  res.status(203).json(activity);
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const activity = await db.activity.delete({ where: { id_assessment: id } });
  res.status(204).json(activity);
};
