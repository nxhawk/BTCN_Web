const express = require("express");
const actorController = require("../controllers/actor.c");
const router = express.Router();

router.get("/", actorController.renderIndexPage);
router.post("/:search/:page", actorController.searchPage);

module.exports = router;
