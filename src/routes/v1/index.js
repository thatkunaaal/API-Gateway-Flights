const express = require("express");
const { infoController } = require("../../controllers");
const router = express.Router();
const UserRoutes = require("./user-routes");

router.use("/user", UserRoutes);
router.get("/info", infoController);

module.exports = router;
