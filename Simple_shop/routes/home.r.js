const express = require("express");
const router = express.Router();
const homeControllers = require("../controllers/home.c");
const authMw = require("../middleware/auth.mw");

router.get("/", authMw.mustLogin, homeControllers.render);

module.exports = router;
