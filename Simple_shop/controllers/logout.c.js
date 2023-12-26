module.exports = {
  logout: async (req, res, next) => {
    try {
      req.logout(function (err) {
        if (err) {
          throw new Error(err);
        }
        res.redirect("/login");
      });
    } catch (error) {
      next(error);
    }
  },
};
