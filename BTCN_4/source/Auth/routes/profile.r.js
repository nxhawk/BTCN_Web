const app = require("express");
const router = app.Router();
const authMiddleware = require("../middlewares/auth.mw")

const profileController = require("../controllers/profile.c")

router.use(authMiddleware.isAuth);
router.get('/', profileController.renderProfilePage);
router.post('/', profileController.handleProfile);


module.exports = router;