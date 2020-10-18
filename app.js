var createError = require("http-errors");
var session = require("express-session");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// var lessMiddleware = require("less-middleware");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

/**
 * notice: this session must be set before all the router,
 * otherwise, you would recieve error when you access the
 * attribute in the session
 */
app.use(
  session({
    name: "my pet platform",
    secret: "my pet platform",
    cookie: { maxAge: 7 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: true
  })
);

app.use("/", require("./routes/routers"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
