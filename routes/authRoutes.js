const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/logout", authController.logout);

router.post("/storeToken", authController.storeToken);

module.exports = router;
