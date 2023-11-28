require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT | 21447;
const HOSTNAME = process.env.HOST | "localhost";

// custom template engine
app.engine("html", require("./21447"));

app.set("views", "./views");
app.set("view engine", "html");

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// import database
require("./models/createDB.m").initialDB();

//route
app.use("/", require("./routes/home.r"));
app.use("/detail", require("./routes/detailMovie.r"));
app.use("/actor", require("./routes/actor.r"));
app.use("/reviews", require("./routes/review.r"));
app.use("/search", require("./routes/search.r"));
app.use("/favorites", require("./routes/favorite.r"));

// error-handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
  res.end();
});

// run server
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running at port ${PORT}`);
});
