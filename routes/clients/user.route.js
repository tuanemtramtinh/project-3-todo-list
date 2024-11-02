const express = require("express");
const router = express.Router();
const controller = require("../../controllers/user.controller");
const userMiddleware = require("../../middlewares/user.middlewares");

router.post("/register", controller.registerPost);

router.post("/login", controller.loginPost);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otp);

router.post("/password/reset", controller.resetPassword);

router.get("/profile", userMiddleware.requireAuth, controller.profile);

module.exports = router;
