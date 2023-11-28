const express = require("express");
const homeController = require("../controllers/home.c");
const router = express.Router();

router.get("/", homeController.renderIndexPage);

module.exports = router;
