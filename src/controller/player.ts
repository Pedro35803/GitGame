import { Request, Response } from "express";
import { db } from "../db";

const select = {
  id_user: true,
  complete_game_percentage: true,
  user: {
    select: {
      email: true,
      name: true,
    },
  },
};

export const create = async (req: Request, res: Response) => {
  const user = await db.player.create({
    data: req.body,
    select,
  });
  res.status(201).json(user);
};

export const getById = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const user = await db.player.findUniqueOrThrow({
    where: { id_user },
    select,
  });
  res.json(user);
};

export const getAll = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const user = await db.player.findMany({ select, where: { id_user } });
  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const where = { id_user };

  await db.player.findUniqueOrThrow({ where });

  const user = await db.player.update({ data: req.body, where, select });
  res.status(203).json(user);
};

export const destroy = async (req: Request, res: Response) => {
  const { id_user } = req.params;
  const user = await db.player.delete({ where: { id_user } });
  res.status(204).json(user);
};
