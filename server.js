var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// TODO: update to enable running on Heroku
var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// TODO: uncomment when experiment is done
require("./controllers/routes.js")(app);

// TODO: I dont' think I want this with handlebars in picture
//app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapegracedb");

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
