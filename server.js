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
  console.log('Starting to scrape')
  request("http://www.heraldsun.com/news/local/community/chapel-hill-news/", function(error, response, html) {
    var $ = cheerio.load(html);

    $("div.teaser").each(function(i, element) {
      var link = $(element).children('.title').children('a').attr('href');
      var title = $(element).children('.title').children('a').text();
      title = title.trim();
      var summary = $(element).children('.summary').text();
      if (summary === '') {
        summary = 'No summary available';
      } else {
        // removes leading and trailing line breaks
        summary = summary.replace(/^\s+|\s+$/g, '');
      }
      // console.log({link});
      // console.log({title})
      // console.log({summary});
      // console.log();
      // TODO: improve this from school solution
      if (link !== undefined) {
        // test to see if article has already been stored
        // TODO: change to mongoose
        db.articles.findOne({link: link}, function(err, doc) {
          if (doc.length === 0) {
            db.articles.insert ({
              "title": title,
              "link": link,
              "summary": summary
            });
          } else {
            console.log('article already in DB');
          }
        }) // end of query processing
      }
    }); // end of .each

    res.send("Site scraped");
  });
}); // end of scraping


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
