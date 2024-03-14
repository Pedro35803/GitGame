import express from "express";

import * as auth from "./controller/auth";
import * as user from "./controller/user";
import * as player from "./controller/player";
import authorization from "./middleware/isAuttenticate";
import { verifyPermision } from "./middleware/verifyPermision";

export const router = express.Router();

const generateRouter = (path) => {
  const pathID = `/${path}/:id`;
  router.post(path, player.create).get(path, player.getAll);
  router
    .get(pathID, player.getById)
    .patch(pathID, player.update)
    .delete(pathID, player.destroy);
};

router.post("/register", auth.register);
router.post("/login", auth.login);

router
  .route("/user/me")
  .get(authorization, user.getById)
  .patch(authorization, user.update)
  .delete(authorization, user.destroy);

router
  .post("/player", player.create)
  .get("/player", authorization, verifyPermision, player.getAll);

router
  .get("/player/:id_user", authorization, player.getById)
  .patch("/player/:id_user", authorization, player.update)
  .delete("/player/:id_user", authorization, player.destroy);
