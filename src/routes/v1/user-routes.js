const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middleware");

router.post(
  "/signup",
  UserMiddleware.validateSingupRequest,
  UserController.singup
);

router.post("/signin", UserController.signin);

module.exports = router;
