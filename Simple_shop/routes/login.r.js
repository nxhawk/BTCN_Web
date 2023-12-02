const express = require("express");
const router = express.Router();
const loginControllers = require("../controllers/login.c");
const authMiddleware = require("../middleware/auth.mw");

router.get("/", authMiddleware.dontLogin, loginControllers.render);
router.post("/", authMiddleware.dontLogin, loginControllers.login);

module.exports = router;
