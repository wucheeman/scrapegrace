var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// TODO: update to enable running on Heroku
var PORT = process.env.PORT || 3000;

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

require("./controllers/routes.js")(app);

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapegracedb";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
