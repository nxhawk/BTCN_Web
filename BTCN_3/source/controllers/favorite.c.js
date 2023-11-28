const favoritesM = require("../models/favorites.m");
const moviesM = require("../models/movies.m");

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
      const favorites = await favoritesM.getAll();

      const pagination = [];
      let numPage = Math.floor(favorites.length / 6);
      if (favorites.length % 6 > 0) numPage += 1;
      for (let index = 1; index <= numPage - 1; index++) {
        pagination.push({ id: index + 1 });
      }

      const movies = [];
      for (let i = 0; i < Math.min(favorites.length, 6); i++) {
        const e = favorites[i];
        const movie = await moviesM.getByID(e.movieId);
        movies.push(movie);
      }

      res.render("favorites", {
        isDark,
        movies,
        pagination,
        link,
        theme,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteFavorite: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      const rs = await favoritesM.checkExist(id);
      if (rs.exists) {
        await favoritesM.deleteById(id);
      }

      return res.json(true);
    } catch (error) {
      next(error);
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { id } = req.params;
      const rs = await favoritesM.checkExist(id);
      const movie = await moviesM.getByID(id);
      if (!rs.exists) {
        await favoritesM.add(id, movie.boxOffice);
      }

      return res.json(true);
    } catch (error) {
      next(error);
    }
  },
  getPage: async (req, res, next) => {
    try {
      let { page } = req.params;

      page = parseInt(page) - 1;

      const favorites = await favoritesM.getAll();

      const movies = [];
      for (
        let i = page * 6;
        i < Math.min(favorites.length, page * 6 + 6);
        i++
      ) {
        const e = favorites[i];
        const movie = await moviesM.getByID(e.movieId);
        movies.push(movie);
      }
      res.status(200).json({ data: movies });
    } catch (error) {
      next(error);
    }
  },
  isExist: async (req, res, next) => {
    try {
      const { id } = req.params;

      const re = await favoritesM.checkExist(id);
      res.json(re.exists);
    } catch (error) {
      next(error);
    }
  },
};
