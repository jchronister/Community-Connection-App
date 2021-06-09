"use strict";

var createHttpError = require("http-errors");
var express = require("express");
// var path = require("path");
var logger = require("morgan");

const cors = require("cors");
const accountsRouter = require("./routes/accounts");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const resetDataRouter = require("./routes/dataInit");
const { getReturnObject } = require("./middleware/return-object");
const passDBConnection = require("./middleware/database.js");

// Setup process.env from .env File
require("dotenv").config();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(passDBConnection);
app.use("/api/v1/CS569FP/accounts", accountsRouter);
app.use("/api/v1/CS569FP/users", usersRouter);
app.use("/api/v1/CS569FP/posts", postsRouter);
app.use("/api/v1/CS569FP/data", resetDataRouter);

// Handle 404 URL Not Found
app.use(function (req, res, next) {
    next(createHttpError(404, "URL Not Found"));
});

// Error Handler
app.use(function (err, req, res, next) {// eslint-disable-line no-unused-vars
    

    // Return Error Message
    // res.status(err.status || 500);
    // sendJSON.call(res, err.message || err, null);
    res.status(err.status || 500).json(
        getReturnObject(err.message || err, null)
    );
});

module.exports = app;
