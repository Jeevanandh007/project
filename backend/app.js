const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const constants = require("./constants");

const usersRouter = require("./routes/user.js");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(flash());
app.use(
  session({
    secret: constants.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect(constants.mongoURI);

mongoose.connection
  .once("open", () => {
    console.log("MongoDB database connection established successfully");
  })
  .on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/users", usersRouter);

module.exports = app;
