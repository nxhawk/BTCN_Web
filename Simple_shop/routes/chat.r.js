const express = require("express");
const router = express.Router();
const chatControllers = require("../controllers/chat.c");

router.get("/", chatControllers.renderPage);
router.post("/", chatControllers.postMessage);
router.get("/message", chatControllers.getMessage);

module.exports = router;
