const moviesM = require("../models/movies.m");
const namesM = require("../models/names.m");

module.exports = {
  renderIndexPage: async (req, res, next) => {
    try {
      const isDark = req.query?.dark || false;
      const search = req.query?.search || "";
      let movies = await moviesM.searchByName(search);
      let actors = await namesM.searchByName(search);
      let link = "",
        theme = "light";
      if (isDark) {
        link = "&dark=true";
        theme = "dark";
      }

      const pagination = [];
      let numPage = Math.floor(movies.length / 6);
      if (movies.length % 6 > 0) numPage += 1;
      for (let index = 1; index <= Math.min(numPage - 1, 30); index++) {
        pagination.push({ id: index + 1 });
      }

      const pagination2 = [];
      numPage = Math.floor(actors.length / 3);
      if (actors.length % 3 > 0) numPage += 1;
      for (let index = 1; index <= Math.min(numPage - 1, 30); index++) {
        pagination2.push({ id: index + 1 });
      }

      movies = movies.splice(0, 6);
      actors = actors.splice(0, 3);

      const ac = actors.length > 0;
      const ad = movies.length > 0;

      res.render("search", {
        isDark,
        movies,
        actors,
        search,
        pagination,
        pagination2,
        ad,
        ac,
        link,
        theme,
      });
    } catch (error) {
      next(error);
    }
  },
  searchPage: async (req, res, next) => {
    try {
      let { page, search } = req.params;

      page = parseInt(page) - 1;

      const movies = await moviesM.searchByName(search);

      res.status(200).json({ data: movies.splice(page * 6, 6) });
    } catch (error) {
      next(error);
    }
  },
};
