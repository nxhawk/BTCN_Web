const app = require("express");
const router = app.Router();
const passport = require("passport");

const authController = require('../controllers/auth.c')

router.get('/avatar', authController.getAllAvatar);
router.get('/login', authController.renderLoginPage);
router.get('/register', authController.renderRegisterPage);
router.get('/logout', authController.handleLogout);
router.get('/me', authController.checkAccessToken);
router.post('/register', authController.handleRegister);
router.post(
  "/login",
  authController.handleLogin
);

module.exports = router;