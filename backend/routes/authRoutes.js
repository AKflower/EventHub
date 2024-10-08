const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/auth/register", authController.register);
router.post("/auth/verify-email", authController.verifyEmail);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

module.exports = router;
