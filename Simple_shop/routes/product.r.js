const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/product.c");

router.post("/:ProductID/edit", productControllers.updateProduct);
router.post("/:ProductID/delete", productControllers.deleteProduct);
router.post("/", productControllers.addProduct);
router.get("/:ProductID", productControllers.render);

module.exports = router;
