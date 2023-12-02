const userM = require("../models/user.m");
const CryptoJS = require("crypto-js");
const hashLength = 64;

module.exports = {
  render: async (req, res, next) => {
    try {
      if (req.session.uid && req.session.username) {
        userM.getByID(req.session.uid).then((user) => {
          if (user.length > 0 && user[0].Username === req.session.username) {
            return res.redirect("/");
          }
        });
      }
      res.render("register", { hideHF: "d-none", display: "none" });
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      let newUser = req.body;
      const pw = newUser.password;
      userM.getByUsername(newUser.username).then((rs) => {
        if (rs.length === 0) {
          const salt = Date.now().toString(16);
          const pwSalt = newUser.password + salt;
          const pwHashed = CryptoJS.SHA3(pwSalt, {
            outputLength: hashLength * 4,
          }).toString(CryptoJS.enc.Hex);
          newUser.password = pwHashed + salt;
          // new user
          userM.add(newUser);
          res.render("registerSuccess", { hideHF: "d-none" });
        } else {
          newUser.password = pw;
          res.render("register", {
            data: newUser,
            display: "block",
            hideHF: "d-none",
          });
        }
      });
    } catch (error) {
      next(error);
    }
  },
};
