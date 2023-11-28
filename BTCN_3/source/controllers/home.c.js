const moviesM = require("../models/movies.m");
const favoritesM = require("../models/favorites.m");

module.exports = {
  renderIndexPage: async (req, res, next) => {
    try {
      const isDark = req.query?.dark || false;
      let link = "",
        theme = "light";
      if (isDark) {
        link = "&dark=true";
        theme = "dark";
      }

      const top5Rating = await moviesM.getTop5();
      const topBoxOffice = await moviesM.getTopBoxOffice();
      const movies = top5Rating;
      const favoritesList = await favoritesM.getTopFavorites();
      const topFavorites = [];
      const movies_active = movies?.splice(0, 1);

      for (let i = 0; i < favoritesList.length; i++) {
        const e = favoritesList[i];
        const movie = await moviesM.getByID(e.movieId);
        topFavorites.push(movie);
      }

      let listMovieBoxOffice = [];
      for (let i = 0; i < 10; i++)
        listMovieBoxOffice.push(topBoxOffice.splice(0, 3));

      let listMovieFavorites = [];
      for (let i = 0; i < 10; i++)
        listMovieFavorites.push(topFavorites.splice(0, 3));

      res.render("index", {
        isDark,
        top5Rating,
        listMovieBoxOffice,
        listMovieFavorites,
        movies,
        movies_active,
        link,
        theme,
      });
    } catch (error) {
      next(error);
    }
  },
};
