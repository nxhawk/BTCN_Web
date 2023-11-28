require("dotenv").config();

module.exports = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  max: 30, // use up to 30 connections
};
