const express = require("express");
const router = express.Router();
const loginControllers = require("../controllers/login.c");
const passport = require("passport");

router.get("/", loginControllers.render);
router.get("/federated/google", passport.authenticate("google"));
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post(
  "/",
  passport.authenticate("myS", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  loginControllers.login
);

module.exports = router;
