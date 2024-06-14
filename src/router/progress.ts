import express from "express";

import * as capterProgress from "../controller/progress/capterProgress";
import * as levelProgress from "../controller/progress/levelProgress";
import * as contentProgress from "../controller/progress/contentProgress";
import * as progress from "../controller/progress/userProgress";

import { authorization } from "../middleware/isAuttenticate";
import { verifyPermission } from "../middleware/verifyPermission";

export const router = express.Router();

const generateRoutersGame = (path, controller) => {
  router
    .route(path)
    .post(
      authorization,
      controller.handleAccessAdmin,
      controller.handleAccessUser,
      controller.create
    )
    .get(
      authorization,
      verifyPermission,
      controller.handleAccessAdmin,
      controller.getAll
    );

  router
    .route(`${path}/:id`)
    .get(
      authorization,
      controller.handleAccessAdmin,
      controller.handleAccessUser,
      controller.getById
    )
    .patch(
      authorization,
      controller.handleAccessAdmin,
      controller.handleAccessUser,
      controller.update
    )
    .delete(
      authorization,
      controller.handleAccessAdmin,
      controller.handleAccessUser,
      controller.destroy
    );

  const progressMeURL = "/progress" + path + "/me";
  router.get(progressMeURL, authorization, controller.getAllUser);
};

router
  .route("/progress/me")
  .post(authorization, progress.generateProgress)
  .get(authorization, progress.getProgress, progress.generateProgress);

generateRoutersGame("/capter_progress", capterProgress);
generateRoutersGame("/level_progress", levelProgress);
generateRoutersGame("/content_progress", contentProgress);
