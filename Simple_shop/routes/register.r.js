const express = require("express");
const router = express.Router();
const registerControllers = require("../controllers/register.c");
const authMw = require("../middleware/auth.mw");

router.get("/", registerControllers.render);
router.post("/", registerControllers.register);

module.exports = router;
