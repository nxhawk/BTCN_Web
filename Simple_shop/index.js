const hbs = require("express-handlebars");
const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "/public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// use session
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "secret-key-123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

// setup handlers
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "/views/layouts/"),
    partialsDir: path.join(__dirname, "/views/partials/"),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

// middleware
const authMw = require("./middleware/auth.mw");

// Routes
app.use("/login", require("./routes/login.r"));
app.use("/register", require("./routes/register.r"));
app.use("/logout", require("./routes/logout.r"));
app.use("/category", authMw.mustLogin, require("./routes/category.r"));
app.use("/product", authMw.mustLogin, require("./routes/product.r"));

// -------- homepages
app.use("/", require("./routes/home.r"));

// error handlers
app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
  res.end();
});

// run server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
