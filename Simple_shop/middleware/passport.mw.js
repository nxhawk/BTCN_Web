require("dotenv").config();
const passport = require("passport");
const MyStrategy = require("../utils/customSPP.u");
const GoogleStrategy = require("passport-google-oidc");
const bcrypt = require("bcrypt");
const userM = require("../models/user.m");

//store session
passport.serializeUser((user, done) => {
  done(null, user.Username);
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
      var user = (await userM.getByUsername(username))[0];
      if (!user) {
        done("invalid", null);
      }
      var result = false;
      if (user) {
        result = await bcrypt.compare(password, user.Password);
        // Wait for the password comparison
      }
      if (!result) {
        done("invalid", null);
      }
      done(null, user);
    }, {})
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: "/login/oauth2/redirect/google",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      },
      async function verify(issuer, profile, cb) {
        const rs1 = await userM.getByEmail(profile.emails[0].value);
        // have
        if (rs1.length > 0) {
          var user = rs1[0];
          return cb(null, user);
        } else {
          // new
          const user = await userM.add({
            username: profile.displayName,
            password: "1234",
            name: profile.name.familyName + " " + profile.name.givenName,
            email: profile.emails[0].value,
            dob: "2003-07-20",
          });
          return cb(null, user);
        }
      }
    )
  );
};
