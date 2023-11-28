const express = require("express");
const searchController = require("../controllers/search.c");
const router = express.Router();

router.get("/", searchController.renderIndexPage);
router.post("/:search/:page", searchController.searchPage);

module.exports = router;
