import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../../db";
import { redis } from "../../redis";

const include = {
  userLogged: { select: { email: true, name: true } },
  anonymous: true,
};

const objResponse = (user) => {
  const type = !!user.anonymous ? "anonymous" : "logged";
  return {
    ...user,
    ...user.userLogged,
    userLogged: undefined,
    anonymous: undefined,
    type,
  };
};

export const updateImage = async (req: Request, res: Response) => {
  const id = req.userId;
  const { filename } = req.file;

  const host = req.body.host || "";
  const picture = `${host}/images/${filename}`;

  const user = await db.user.update({
    where: { id },
    data: { picture },
    include,
  });

  const response = objResponse(user);
  res.status(201).json(response);
};

export const getById = async (req: Request, res: Response) => {
  const id = req.userId;
  const user = await db.user.findUniqueOrThrow({
    where: { id },
    include,
  });

  const response = objResponse(user);
  res.json(response);
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

  const user = await db.user.update({
    data: {
      userLogged: { update: { data: { ...update }, where: { id_user: id } } },
    },
    include,
    where,
  });

  const response = objResponse(user);
  res.status(203).json(response);
};

export const destroy = async (req: Request, res: Response) => {
  const id = req.userId;
  const user = await db.user.delete({ where: { id } });
  res.status(204).json(user);
};

export const getProgress = async (req: Request, res: Response) => {
  const id = req.userId;
  const data = await redis.get(`progress-${id}`);
  const response = JSON.parse(data)
  res.json(response);
};

export const generateProgress = async (req: Request, res: Response) => {
  const id = req.userId;
  const progress = await db.capterProgress.findMany({
    where: { id_user: id },
  });

  const capter = await db.capter.findMany({
    include: { CapterProgress: { where: { id_user: id } } },
  });
  const completeGamePercentage = (progress.length * 100) / capter.length;

  // const countPlayerProgress = capter.filter(
  //   (obj) => obj.playerProgress.length
  // ).length;
  // const completeGamePercentage = (countPlayerProgress * 100) / capter.length;

  console.log(completeGamePercentage);

  // const calculateConclusion = capter.map((objCapter) => {
  //   const percentageCapter = objCapter.playerProgress.length;
  //   console.log(objCapter.playerProgress);
  // });

  const secondInMinute = 60;
  const minutes = 5;

  await redis.set(
    `progress-${id}`,
    JSON.stringify({ completeGamePercentage }),
    {
      EX: minutes * secondInMinute,
    }
  );

  res.status(201).json({ completeGamePercentage });
};
