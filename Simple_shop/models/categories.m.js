const { pgp, db } = require("../models/DBconnection");

module.exports = {
  add: async (data) => {
    var CatID = await db.one('SELECT MAX("CatID") FROM "Categories"');
    CatID = CatID.max + 1;
    const rs = await db.one(
      'INSERT INTO "Categories"("CatID","CatName") VALUES($1, $2) RETURNING *',
      [CatID, data]
    );
    return rs;
  },
  update: async (CatID, data) => {
    const rs = await db.none(
      'UPDATE "Categories" SET "CatName" = $1 WHERE "CatID" = $2',
      [data, CatID]
    );
    return rs;
  },
  delete: async (CatID) => {
    const rs = await db.any('DELETE FROM "Categories" WHERE "CatID"=$1', [
      CatID,
    ]);
    return rs;
  },

  getAll: async () => {
    const rs = await db.any('SELECT * FROM "Categories" ORDER BY "CatID"');
    return rs;
  },
};
