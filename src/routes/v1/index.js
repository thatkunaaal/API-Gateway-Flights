const express = require("express");
const { infoController } = require("../../controllers");
const router = express.Router();
const UserRoutes = require("./user-routes");
const { UserMiddleware } = require("../../middleware");

router.use("/user", UserRoutes);
router.get("/info", UserMiddleware.checkAuth, infoController);

module.exports = router;
