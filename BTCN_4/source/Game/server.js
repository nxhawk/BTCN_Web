require("dotenv").config();
const express = require("express");
const hbs = require("express-handlebars");
const app = express();
const cookieparser = require("cookie-parser");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// congif handlebars
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    helpers: require('./utils/helpers.u')
  }),
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

require('./routes')(app);