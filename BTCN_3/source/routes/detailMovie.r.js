const express = require("express");
const detailMovieController = require("../controllers/detailMovie.c");
const router = express.Router();

router.get("/", detailMovieController.renderIndexPage);

module.exports = router;
