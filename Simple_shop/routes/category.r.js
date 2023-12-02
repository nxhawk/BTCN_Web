const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/category.c");

router.post("/:CatID/edit", categoryControllers.updateCategory);
router.post("/:CatID/delete", categoryControllers.deleteCategory);
router.post("/", categoryControllers.addCategory);
router.get("/:CatID", categoryControllers.render);

module.exports = router;
