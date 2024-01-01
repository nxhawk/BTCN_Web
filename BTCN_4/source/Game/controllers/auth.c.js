const userM = require('../models/user.m')
module.exports = {
  handleLogout: async (req, res, next) => {
    try {
      const isLogin = !!req.cookies.jwt;
      if (isLogin) {
        await userM.Logout(req.cookies.username);
        res.clearCookie("jwt");
        res.clearCookie("access");
        res.clearCookie("username");
      }
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
}