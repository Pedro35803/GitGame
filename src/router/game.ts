import express from "express";

import * as objective from "../controller/game/objective";
import * as activity from "../controller/game/activity";
import * as reports from "../controller/game/reports";
import * as subject from "../controller/game/subject";
import * as capter from "../controller/game/capter";
import * as level from "../controller/game/level";
import * as exam from "../controller/game/exam";

import authorization from "../middleware/isAuttenticate";
import { verifyPermission } from "../middleware/verifyPermission";

export const router = express.Router();

const generateRoutersGame = (path, controller) => {
  router
    .route(path)
    .post(
      authorization,
      verifyPermission,
      controller.handleAccess,
      controller.create
    )
    .get(controller.getAll);

  router
    .route(`${path}/:id`)
    .get(controller.getById)
    .patch(
      authorization,
      verifyPermission,
      controller.handleAccess,
      controller.update
    )
    .delete(
      authorization,
      verifyPermission,
      controller.handleAccess,
      controller.destroy
    );
};

router
  .route("/reports")
  .post(authorization, reports.create)
  .get(authorization, verifyPermission, reports.handleAccess, reports.getAll);

router
  .route("/reports/:id")
  .get(authorization, verifyPermission, reports.handleAccess, reports.getById)
  .patch(authorization, verifyPermission, reports.handleAccess, reports.update)
  .delete(
    authorization,
    verifyPermission,
    reports.handleAccess,
    reports.destroy
  );

generateRoutersGame("/objective", objective);
generateRoutersGame("/activity", activity);
generateRoutersGame("/subject", subject);
generateRoutersGame("/capter", capter);
generateRoutersGame("/level", level);
generateRoutersGame("/exam", exam);
