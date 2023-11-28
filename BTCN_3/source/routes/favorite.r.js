const express = require("express");
const favoriteController = require("../controllers/favorite.c");
const router = express.Router();

router.get("/", favoriteController.renderIndexPage);
router.get("/exist/:id", favoriteController.isExist);
router.delete("/:id", favoriteController.deleteFavorite);
router.post("/:id", favoriteController.addFavorite);
router.post("/page/:page", favoriteController.getPage);

module.exports = router;
