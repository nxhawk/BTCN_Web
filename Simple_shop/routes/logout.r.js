const express = require("express");
const router = express.Router();
const logoutControllers = require("../controllers/logout.c");
const authMw = require("../middleware/auth.mw");

router.get("/", authMw.mustLogin, logoutControllers.logout);

module.exports = router;
