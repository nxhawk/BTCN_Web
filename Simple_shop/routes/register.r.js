const express = require("express");
const router = express.Router();
const registerControllers = require("../controllers/register.c");
const authMw = require("../middleware/auth.mw");

router.get("/", authMw.dontLogin, registerControllers.render);
router.post("/", authMw.dontLogin, registerControllers.register);

module.exports = router;
