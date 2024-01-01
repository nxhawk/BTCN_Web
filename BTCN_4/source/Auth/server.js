require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
const https = require("https");
const hbs = require("express-handlebars");
const session = require("express-session");
const cookieparser = require("cookie-parser");

const PORT = process.env.AUTH_PORT;
const credentials = {
  key: process.env.PRIVATE_KEY,
  cert: process.env.CERTIFICATE,
};

app.use(
  cors({
    origin: `http://localhost:${process.env.GAME_PORT}`,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
app.use(cookieparser());
app.use(express.static(__dirname + "/public"));


// congif handlebars
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  }),
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

// routes
require("./middlewares/passport.mw")(app);
require("./routes")(app);

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () =>
  console.log(`Server Auth listening on port ${PORT}`),
);