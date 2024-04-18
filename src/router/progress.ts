import express from "express";

import * as playerProgress from "../controller/progress/playerProgress";
import * as capterProgress from "../controller/progress/capterProgress";

import authorization from "../middleware/isAuttenticate";
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

generateRoutersGame("/playerProgress", playerProgress);
generateRoutersGame("/capterProgress", capterProgress);
