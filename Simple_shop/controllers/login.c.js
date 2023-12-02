const userM = require("../models/user.m");
const CryptoJS = require("crypto-js");
const hashLength = 64;

module.exports = {
  render: async (req, res, next) => {
    try {
      return res.render("login", { hideHF: "d-none" });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const user = req.body;
      userM.getByUsername(user.username).then((rs) => {
        if (rs.length === 0) {
          // check username
          return res.render("login", {
            hideHF: "d-none",
            data: user,
            showError: true,
          });
        } else {
          // check password
          const pwDb = rs[0].Password;
          const salt = pwDb.slice(hashLength);
          const pwSalt = user.password + salt;
          const pwHashed = CryptoJS.SHA3(pwSalt, {
            outputLength: hashLength * 4,
          }).toString(CryptoJS.enc.Hex);
          if (pwDb !== pwHashed + salt)
            return res.render("login", {
              data: user,
              hideHF: "d-none",
              showError: true,
            });

          // all good
          req.session.uid = rs[0].ID;
          req.session.username = rs[0].Username;
          return res.redirect("/");
        }
      });
    } catch (error) {
      next(error);
    }
  },
};
