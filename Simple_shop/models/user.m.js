const { pgp, db } = require("../models/DBconnection");

module.exports = {
  getByUsername: async (data) => {
    const rs = db.any('SELECT * FROM "Users" WHERE "Username"=$1', [data]);
    return rs;
  },
  getByID: async (ID) => {
    const rs = db.any('SELECT * FROM "Users" WHERE "ID"=$1', [ID]);
    return rs;
  },
  getByEmail: async (email) => {
    const rs = db.any('SELECT * FROM "Users" WHERE "Email"=$1', [email]);
    return rs;
  },
  add: async (data) => {
    let ID = await db.one('SELECT MAX("ID") FROM "Users"');
    ID = ID.max + 1;
    const rs = await db.one(
      'INSERT INTO "Users"("ID","Username","Password","Name","Email","DOB","Permission") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [ID, data.username, data.password, data.name, data.email, data.dob, 0]
    );
    return rs;
  },
};
