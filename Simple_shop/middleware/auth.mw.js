const userM = require("../models/user.m");

module.exports = {
  mustLogin: async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        next();
      } else return res.redirect("/login");
    } catch (error) {
      next(error);
    }
  },
  dontLogin: async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        return res.redirect("/");
      } else next();
    } catch (error) {
      next(error);
    }
  },
};
