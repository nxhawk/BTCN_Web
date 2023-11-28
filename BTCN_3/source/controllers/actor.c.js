const moviesM = require("../models/movies.m");
const actorM = require("../models/names.m");

module.exports = {
  renderIndexPage: async (req, res, next) => {
    const isDark = req.query?.dark || false;
    const id = req.query?.id;
    let link = "",
      theme = "light";
    if (isDark) {
      link = "&dark=true";
      theme = "dark";
    }

    try {
      const actor = await actorM.getByID(id);
      const movies = await moviesM.getByActorId(id);

      res.render("actor", { isDark, actor, movies, link, theme });
    } catch (error) {
      next(error);
    }
  },
  searchPage: async (req, res, next) => {
    try {
      let { page, search } = req.params;

      page = parseInt(page) - 1;

      const actors = await actorM.searchByName(search);
      res.status(200).json({ data: actors.splice(page * 3, 3) });
    } catch (error) {
      next(error);
    }
  },
};
