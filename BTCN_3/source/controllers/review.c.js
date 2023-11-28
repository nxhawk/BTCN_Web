const reviewsM = require("../models/reviews.m");

module.exports = {
  reviewsPage: async (req, res, next) => {
    try {
      let { page, id } = req.params;
      page = parseInt(page) - 1;

      const reviews = await reviewsM.getByIdMovie(id);

      res.status(200).json({ data: reviews.splice(page * 3, 3) });
    } catch (error) {
      next(error);
    }
  },
};
