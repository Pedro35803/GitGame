import express from "express";

import * as assessment from "../controller/assessment";
import * as objective from "../controller/objective";
import * as activity from "../controller/activity";
import * as reports from "../controller/reports";
import * as subject from "../controller/subject";
import * as capter from "../controller/capter";
import * as level from "../controller/level";

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

generateRoutersGame("/assessment", assessment);
generateRoutersGame("/objective", objective);
generateRoutersGame("/activity", activity);
generateRoutersGame("/subject", subject);
generateRoutersGame("/capter", capter);
generateRoutersGame("/level", level);
