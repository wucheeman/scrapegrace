var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// TODO: update to enable running on Heroku
var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

require("./controllers/routes.js")(app);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapegracedb");

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
