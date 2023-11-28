const { pgp, db } = require("../utils/DBConnection.u");

module.exports = {
  getAll: async () => {
    const rs = await db.any('SELECT * FROM "Names"');
    return rs;
  },
  checkID: async (data) => {
    const rs = db.one('select exists(select 1 from "Names" where "id"=$1)', [
      data,
    ]);
    return rs;
  },
  getByID: async (data) => {
    try {
      const rs = db.any('SELECT * FROM "Names" WHERE "id"=$1', [data]);
      return rs;
    } catch (err) {
      next(err);
    }
  },
  searchByName: async (name) => {
    name = name.toLowerCase();
    const rs = db.any(
      `SELECT * FROM "Names" WHERE lower("name") LIKE '%${name}%'`
    );
    return rs;
  },
  add: async (data) => {
    const rs = await db.one(
      'INSERT INTO "Names"("id","name","role","image","summary","birthDate","deathDate","awards","height") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        data.id,
        data.name,
        data.role,
        data.image,
        data.summary,
        data.birthDate,
        data.deathDate,
        data.awards,
        data.height,
      ]
    );
    return rs;
  },
  deleteAll: async () => {
    const rs = await db.none('DELETE FROM "Names"');
  },
};
