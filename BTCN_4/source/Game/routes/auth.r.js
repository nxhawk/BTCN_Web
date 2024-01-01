const app = require("express");
const router = app.Router();

const authController = require('../controllers/auth.c')

router.get('/logout', authController.handleLogout);

module.exports = router;