const moviesM = require("../models/movies.m");
const namesM = require("../models/names.m");
const reviewsM = require("../models/reviews.m");
const favoritesM = require("../models/favorites.m");

module.exports = {
  renderIndexPage: async (req, res, next) => {
    try {
      const isDark = req.query?.dark || false;
      const id = req.query?.id;
      let link = "",
        theme = "light";
      if (isDark) {
        link = "&dark=true";
        theme = "dark";
      }

      let inStock = await favoritesM.checkExist(id);
      inStock = inStock.exists;

      const movie = await moviesM.getByID(id);
      let reviews = await reviewsM.getByIdMovie(id);

      const paginations = [];
      let numPage = Math.floor(reviews.length / 3);
      if (reviews.length % 3 > 0) numPage += 1;
      for (let index = 1; index <= Math.min(numPage - 1, 30); index++) {
        paginations.push({ id: index + 1 });
      }
      reviews = reviews.splice(0, 3);

      const movies = [];
      const actors = [];
      movies.push(movie);

      for (let i = 0; i < movie.actorList.length; i++) {
        const actor = await namesM.getByID(movie.actorList[i]);
        actors.push(...actor);
      }

      const hasReview = paginations.length > 0;

      res.render("detailMovie", {
        isDark,
        movies,
        actors,
        reviews,
        inStock,
        paginations,
        hasReview,
        link,
        theme,
      });
    } catch (error) {
      next(error);
    }
  },
};
