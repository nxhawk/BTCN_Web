const express = require("express");
const reviewController = require("../controllers/review.c");
const router = express.Router();

router.post("/:id/:page", reviewController.reviewsPage);

module.exports = router;
