import { Request, Response } from "express";
import { db } from "../../db";
import { redis } from "../../redis";

export const getProgress = async (req: Request, res: Response) => {
  const id = req.userId;
  const data = await redis.get(`progress-${id}`);
  const response = JSON.parse(data);
  res.json(response);
};

const calculatePercent = (listGame = [], listProgress = []) => {
  return Math.floor((listProgress.length * 100) / listGame.length);
};

export const generateProgress = async (req: Request, res: Response) => {
  const id = req.userId;

  const allCapter = await db.capter.findMany({
    include: { capterProgress: { where: { id_user: id } } },
  });

  const allProgress = await db.user.findUnique({
    where: { id },
    include: {
      capterProgress: {
        include: {
          levelProgress: {
            include: {
              contentProgress: true,
              level: {
                include: {
                  orderLevel: true,
                },
              },
            },
          },
          user: true,
        },
        where: {
          id_user: id,
        },
      },
    },
  });

  const percentStatus = {
    TO_DO: 0,
    COMPLETED: 100,
  };

  const allCapterRemap = allProgress.capterProgress.map((capter) => {
    const newLevelProgress = capter.levelProgress
      .map((levelProgress) => {
        const valueCountContent = levelProgress.contentProgress.reduce(
          (acumulator, current) => {
            const contentStatus = { ...percentStatus, IN_PROGRESS: 50 };
            return contentStatus[current.status] / 100 + acumulator;
          },
          0
        );

        const sizeContentLevel = levelProgress.level.orderLevel?.length;
        const percentLevel = ((valueCountContent * 100) / sizeContentLevel) | 0;

        const response = { percentLevel, ...levelProgress };
        return response;
      })
      .flat();

    const percentCapter = newLevelProgress.reduce((acumulator, current) => {
      const percent = percentStatus[current.status] || current.percentLevel;
      return percent + acumulator;
    }, 0);

    return {
      percentCapter,
      capterProgress: {
        ...capter,
        levelProgress: newLevelProgress,
        user: undefined,
      },
    };
  });

  const sumPercent = allCapter.reduce((acumulator, capterCurrent) => {
    const { status } = capterCurrent?.capterProgress[0] || {};

    const currentProgress = allCapterRemap.find(
      (capter) =>
        capter.capterProgress.id === capterCurrent.capterProgress[0]?.id
    );

    const percent = percentStatus[status] | currentProgress?.percentCapter;
    return percent + acumulator;
  }, 0);

  const completeGamePercentage = Math.floor(sumPercent / allCapter.length);
  res.status(201).json({ completeGamePercentage, allCapterRemap });
};
