import { NextFunction, Request, Response } from "express";

export function handleError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("error", error);
  res.status(400);

  if (!error) {
    return res.status(500).send("Unknown server error");
  }

  if (typeof error.status === "number") {
    res.status(error.status);
  }

  if (error.name?.includes("PrismaClient")) {
    const splitMessage = error.message.split("\n");
    const message = splitMessage.at(-1);

    if (error.code === "P2025" || error.code === "P2016") {
      res.status(404).send(`No ${error.meta.modelName} found`);
    } else if (error.code == "P2002") {
      res.status(409);
    }

    res.send(error.meta?.cause || message);
  }

  if (error.name === "NotFoundError") {
    res.status(404);
  }

  if (typeof error.message === "string") {
    return res.send(error.message);
  }

  if (typeof error.inner?.message === "string") {
    return res.send(error.inner.message);
  }

  return res.send("Unknown server error");
}
