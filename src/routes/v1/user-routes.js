const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middleware");

router.post(
  "/signup",
  UserMiddleware.validateSignupRequest,
  UserController.signup
);

router.post("/signin", UserController.signin);

router.post("/role", UserMiddleware.checkAuth, UserController.addRoleToUser);

module.exports = router;
