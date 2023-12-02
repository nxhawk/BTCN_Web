module.exports = {
  logout: async (req, res, next) => {
    try {
      req.session.uid = null;
      req.session.username = null;
      res.redirect("/login");
    } catch (error) {
      next(error);
    }
  },
};
