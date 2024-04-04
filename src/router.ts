import express from "express";

import * as auth from "./controller/auth";
import * as user from "./controller/user";
import * as admin from "./controller/admin";
import * as player from "./controller/player";
import * as reports from "./controller/reports";

import authorization from "./middleware/isAuttenticate";
import { verifyPermission } from "./middleware/verifyPermission";

export const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);

router
  .route("/user/me")
  .get(authorization, user.getById)
  .patch(authorization, user.update)
  .delete(authorization, user.destroy);

router
  .route("/player")
  .post(player.create)
  .get(authorization, player.handleAccess, player.getAll);

router
  .route("/player/:id_user")
  .get(authorization, player.handleAccess, player.getById)
  .patch(authorization, player.handleAccess, player.update)
  .delete(authorization, player.handleAccess, player.destroy);

router
  .route("/admin")
  .post(authorization, verifyPermission, admin.create)
  .get(authorization, verifyPermission, admin.getAll);

router
  .route("/admin/:id_user")
  .get(authorization, verifyPermission, admin.getById)
  .patch(authorization, verifyPermission, admin.update)
  .delete(authorization, verifyPermission, admin.destroy);

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
