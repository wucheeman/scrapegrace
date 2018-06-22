// TODO: improve this whole file from school solution - look at error handling

// Dependencies
var express = require("express");
// TODO: replace with mongoose
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// TODO: update for Mongoose?
// Database configuration
var databaseUrl = "scrapegracedb";
var collections = ["articles"];

// TODO: replace with Mongoose
// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// TODO: move into routes
// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// TODO: update for mongoose
// TODO: update for mongoose
// This retrieves all of the data from articles as a json
app.get("/articles", function(req, res) {
  db.articles.find(function (err, docs) {
    // docs is an array of all the documents in articles
    res.json(docs);
  })
});

// TODO: move into routes
// TODO: update for mongoose
// Accessing this route triggers the server to scrap data and save it to MongoDB.
app.get("/scraped", function(req, res) {
  //console.log('Starting to scrape')
  request("https://boingboing.net/", function(error, response, html) {
    var $ = cheerio.load(html);
    console.log('html loaded')
    var results = [];

    $("a.headline").each(function(i, element) {
      //console.log($(element));
      // var link = $(element).children().attr("href");
      // var title = $(element).children().text();
      // gets title and URL; need to get summary via summary URL
      var link = $(element).attr("href");
      var title = $(element).text();
      // TODO: improve this from school solution
      db.articles.insert ({
        "title": title,
        "link": link
      });
    });

    res.send("Site scraped");
  });
}); // end of scraping


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
