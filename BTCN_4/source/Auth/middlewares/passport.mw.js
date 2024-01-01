require("dotenv").config();
const passport = require("passport");
const MyStrategy = require("../utils/customSPP.u");
const bcrypt = require("bcrypt");
const userM = require("../models/user.m");

//store session
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// check session
passport.deserializeUser(async (un, done) => {
  const u = userM.getByUsername(un);
  if (!u) {
    return done("invalid", null);
  }
  done(null, u);
});

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new MyStrategy(async (username, password, done) => {
      const user = await userM.getByUsername(username);
      if (!user) {
        done("invalid", null);
      }
      var result = false;
      if (user) {
        result = await bcrypt.compare(password, user.password);
        // Wait for the password comparison
      }
      if (!result) {
        done("invalid", null);
      }
      done(null, user);
    }, {})
  );
}