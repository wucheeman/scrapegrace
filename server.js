var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var request = require("request");
// TODO: move from request to axios
// var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

// TODO: update to enable running on Heroku
var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// TODO: update to correct DB
mongoose.connect("mongodb://localhost/scrapegracedb");

// Routes
// TODO: update for correct web site
// TODO: add summary
// Route for scraping the news website
// app.get("/scrape", function(req, res) {
  // axios.get("http://www.echojs.com/").then(function(response) {
  //   var $ = cheerio.load(response.data);

  //   $("article h2").each(function(i, element) {
  //     var result = {};

  //     result.title = $(this)
  //       .children("a")
  //       .text();
  //     result.link = $(this)
  //       .children("a")
  //       .attr("href");

  //     db.Article.create(result)
  //       .then(function(dbArticle) {
  //         console.log(dbArticle);
  //       })
  //       .catch(function(err) {
  //         // TODO: return status page
  //         return res.json(err);
  //       });
  //   });

//     // TODO: send all articles instead?
//     res.send("Scrape Complete");
//   });
// });

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

      if (link !== undefined) {
        var result = {};
        result.title = title;
        result.link = link;
        result.summary = summary;
        
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            // TODO: return status page, not error
           return res.json(err);
        });
      }
    }); // end of .each
    res.send("Site scraped");
  });
}); // end of scraping


// Route for getting all articles from db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // TODO: send status page instead
      res.json(err);
    });
});

// TODO: update to support an array of notes (if necessary!)
// Route for populating article with a note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // TODO: send status page instead
      res.json(err);
    });
});

// TODO: update to support an array of notes
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // TODO: send status page instead
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
