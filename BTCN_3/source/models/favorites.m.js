const { pgp, db } = require("../utils/DBConnection.u");

module.exports = {
  getAll: async () => {
    const rs = await db.any('SELECT * FROM "Favorites" order by id desc');
    return rs;
  },
  getByID: async (data) => {
    const rs = db.one('SELECT * FROM "Favorites" WHERE "movieId"=$1', [data]);
    return rs;
  },
  getTopFavorites: async () => {
    const rs = await db.any(
      'SELECT * FROM "Favorites" order by "boxOffice" desc limit 30'
    );
    return rs;
  },
  checkExist: async (id) => {
    const rs = db.one(
      'select exists(select 1 from "Favorites" where "movieId"=$1)',
      [id]
    );
    return rs;
  },
  add: async (movieId, boxOffice) => {
    const rs = await db.one(
      'INSERT INTO "Favorites"("movieId", "boxOffice") VALUES($1, $2) RETURNING *',
      [movieId, boxOffice]
    );
    return rs;
  },
  deleteAll: async () => {
    const rs = await db.none('DELETE FROM "Favorites"');
  },
  deleteById: async (id) => {
    const rs = await db.none('DELETE FROM "Favorites" WHERE "movieId"=$1', [
      id,
    ]);
  },
};
