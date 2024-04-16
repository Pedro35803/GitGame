import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../../db";

const select = { id: true, email: true, name: true };

export const getById = async (req: Request, res: Response) => {
  const id = req.userId;
  const user = await db.user.findUniqueOrThrow({
    where: { id },
    select: { id: true, email: true, name: true },
  });
  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const { password } = req.body;
  const id = req.userId;
  const where = { id };

  await db.user.findUniqueOrThrow({ where });

  const update = {
    ...req.body,
    password: password ? await bcrypt.hash(password, 10) : undefined,
  };

  const user = await db.user.update({ data: update, where, select });
  res.status(203).json(user);
};

export const destroy = async (req: Request, res: Response) => {
  const id = req.userId;
  const user = await db.user.delete({ where: { id } });
  res.status(204).json(user);
};