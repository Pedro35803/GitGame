import express from "express";

import * as auth from "./controller/auth";
import * as user from "./controller/user";
import authorization from "./middleware/isAuttenticate";

export const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);

router
  .route("/user/me")
  .get(authorization, user.getById)
  .patch(authorization, user.update)
  .delete(authorization, user.destroy);
