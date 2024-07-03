"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://jtamada:a4oDDDQ5nRak03rQ@cluster0.ln5fxwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(function () {
  return console.log("MongoDB connected");
})["catch"](function (err) {
  console.error("Error connecting to MongoDB:", err.message);
});

// Middleware
app.use(bodyParser.json());
app.use("/api/gym", require("./routes/gymRoutes"));

// Start server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});