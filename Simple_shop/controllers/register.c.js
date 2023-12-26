require("dotenv").config();
const userM = require("../models/user.m");
const bcrypt = require("bcrypt");

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
      userM.getByUsername(newUser.username).then(async (rs) => {
        if (rs.length === 0) {
          // hash password
          const saltRounds = 10;
          const hash = await bcrypt.hashSync(newUser.password, saltRounds);
          newUser.password = hash;
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
