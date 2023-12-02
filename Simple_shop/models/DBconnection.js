require("dotenv").config();

const initOptions = {
  /* initialization options */
};

const pgp = require("pg-promise")(initOptions);
const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  max: 30, // use up to 30 connections
};

const db = pgp(connection);

module.exports = {
  pgp,
  db,
};
