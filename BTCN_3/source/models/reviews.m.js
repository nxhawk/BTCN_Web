const { pgp, db } = require("../utils/DBConnection.u");

module.exports = {
  getAll: async () => {
    const rs = await db.any('SELECT * FROM "Reviews"');
    return rs;
  },
  getByIdMovie: async (id) => {
    const rs = db.any('SELECT * FROM "Reviews" WHERE "movieId"=$1', [id]);
    return rs;
  },
  add: async (data) => {
    const rs = await db.one(
      'INSERT INTO "Reviews"("movieId","username","date","rate","title","content") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        data.movieId,
        data.username,
        data.date,
        data.rate,
        data.title,
        data.content,
      ]
    );
    return rs;
  },
  deleteAll: async () => {
    const rs = await db.none('DELETE FROM "Reviews"');
  },
};
