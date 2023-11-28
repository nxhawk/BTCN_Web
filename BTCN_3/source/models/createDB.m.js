const moviesM = require("../models/movies.m");
const namesM = require("../models/names.m");
const reviewsM = require("../models/reviews.m");
const favoritesM = require("../models/favorites.m");

const fs = require("fs");
const pgp = require("pg-promise")(/* initialization options */);

const db = pgp({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
});

async function insertData() {
  fs.readFile("data/data.json", "utf8", async (err, jsonString) => {
    if (err) {
      console.log(err);
      return;
    }
    const Objectdata = JSON.parse(jsonString);

    // insert data moviews
    Objectdata.Movies.forEach(async (movie) => {
      const actorList = [];
      movie.boxOffice =
        parseInt(movie.boxOffice.replace("$", "").replaceAll(",", "")) || 0;
      movie.imDbRating = parseFloat(movie.imDbRating) || 0;
      movie.actorList.forEach((e) => actorList.push(e.id));
      movie.actorList = actorList;
      try {
        await moviesM.add(movie);
      } catch (error) {}
    });

    // insert data Names
    Objectdata.Names.forEach(async (name) => {
      try {
        if (name.image == null) {
          name.image = "https://imdb-api.com/images/original/nopicture.jpg";
        }
        await namesM.add(name);
      } catch (error) {
        console.log(error);
      }
    });

    // insert data Reviews
    Objectdata.Reviews.forEach(async (movie) => {
      movie.items.forEach(async (review) => {
        review.movieId = movie.movieId;
        try {
          await reviewsM.add(review);
        } catch (error) {}
      });
    });

    // inser initial Favorites movies
    for (let i = 10; i < 10 + 30; i++) {
      const movie = Objectdata.Movies[i];
      const movieId = movie.id;
      const boxOffice = movie.boxOffice;
      try {
        await favoritesM.add(movieId, boxOffice);
      } catch (error) {}
    }
  });
}

// insertData();

async function newDatabase() {
  const db2 = pgp({
    database: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });

  // create database
  console.log("Please waiting for insert data to database");
  await db2.none("CREATE DATABASE $1:name", [process.env.DB_NAME]);

  // insert data
  db.connect()
    .then(async (obj) => {
      await db.none(`
        CREATE TABLE "Movies" (
          "id" varchar(50) not null unique, 
          "title" varchar(100), 
          "fullTitle" varchar(255), 
          "year" int4,
          "image" varchar(255),
          "plot" varchar(255),
          "boxOffice" bigint,
          "imDbRating" real,
          "genreList" text[],
          "actorList" text[]
        )`);

      await db.none(`
        CREATE TABLE "Names" (
          "id" varchar(50) not null unique, 
          "name" varchar(100), 
          "role" varchar(255), 
          "image" varchar(255),
          "summary" text,
          "birthDate" varchar(50),
          "deathDate" varchar(50),
          "awards" varchar(255),
          "height" varchar(100)
        )`);

      await db.none(`
        CREATE TABLE "Reviews" (
          "id" serial not null unique, 
          "movieId" varchar(50) not null, 
          "username" varchar(100), 
          "date" varchar(100),
          "rate" varchar(5),
          "title" varchar(255),
          "content" text
        )`);

      await db.none(`
        CREATE TABLE "Favorites" (
          "id" serial not null unique, 
          "movieId" varchar(50) not null,
          "boxOffice" bigint
        )`);

      await insertData();
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(`Initial ${process.env.DB_NAME} successfully`);
}

function initialDB() {
  try {
    db.connect()
      .then((obj) => {
        console.log(`Database ${process.env.DB_NAME} existing`);
      })
      .catch((err) => newDatabase());
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  initialDB,
};
