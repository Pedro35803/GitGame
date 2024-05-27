import express from "express";

import * as capterProgress from "../controller/progress/capterProgress";
import * as levelProgress from "../controller/progress/levelProgress";
import * as contentProgress from "../controller/progress/contentProgress";

import { authorization } from "../middleware/isAuttenticate";
import { verifyPermission } from "../middleware/verifyPermission";

export const router = express.Router();

const generateRoutersGame = (path, controller) => {
  router
    .route(path)
    .post(authorization, controller.handleAccess, controller.create)
    .get(
      authorization,
      verifyPermission,
      controller.handleAccess,
      controller.getAll
    );

  router
    .route(`${path}/:id`)
    .get(authorization, controller.handleAccess, controller.getById)
    .patch(authorization, controller.handleAccess, controller.update)
    .delete(authorization, controller.handleAccess, controller.destroy);
};

generateRoutersGame("/capter_progress", capterProgress);
generateRoutersGame("/level_progress", levelProgress);
generateRoutersGame("/content_progress",  contentProgress);
