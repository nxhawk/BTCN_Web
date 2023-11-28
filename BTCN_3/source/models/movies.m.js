const { pgp, db } = require("../utils/DBConnection.u");

module.exports = {
  getTop5: async () => {
    const rs = await db.any(
      'SELECT * FROM "Movies" order by "imDbRating" desc limit 5'
    );
    return rs;
  },
  getTopBoxOffice: async () => {
    const rs = await db.any(
      'SELECT * FROM "Movies" order by "boxOffice" desc limit 30'
    );
    return rs;
  },
  getTopFavorites: async () => {
    const rs = await db.any(
      'SELECT * FROM "Movies" order by "boxOffice" asc limit 30'
    );
    return rs;
  },
  getAll: async () => {
    const rs = await db.any('SELECT * FROM "Movies"');
    return rs;
  },
  getByID: async (data) => {
    const rs = db.one('SELECT * FROM "Movies" WHERE "id"=$1', [data]);
    return rs;
  },
  getByActorId: async (id) => {
    const rs = db.any('SELECT * FROM "Movies" WHERE $1=ANY("actorList")', [id]);
    return rs;
  },
  searchByName: async (name) => {
    name = name.toLowerCase();
    const rs = db.any(
      `SELECT * FROM "Movies" WHERE lower("title") LIKE '%${name}%'`
    );
    return rs;
  },
  add: async (data) => {
    const rs = await db.one(
      'INSERT INTO "Movies"("id", "title","fullTitle","year","image", "plot","boxOffice", "imDbRating", "genreList", "actorList") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        data.id,
        data.title,
        data.fullTitle,
        data.year,
        data.image,
        data.plot,
        data.boxOffice,
        data.imDbRating,
        data.genreList,
        data.actorList,
      ]
    );
    return rs;
  },
  deleteAll: async () => {
    const rs = await db.none('DELETE FROM "Movies"');
  },
  getTopRating: async () => {
    const rs = await db.any(
      'SELECT * FROM "Movies" ORDER BY "rating" DESC NULLS LAST'
    );
    return rs;
  },
};
