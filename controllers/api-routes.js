var db = require("../models");
// TODO: move from request to axios
var request = require("request");
var cheerio = require("cheerio");

// Routes
// =============================================================
module.exports = function(app) {

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
        res.json(500).send('Server failure');
      });
  });
  
  // Route for populating article with a note
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.status(500).send('Server failure');
      });
  });
  
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
        res.status(500).send('Server failure');
      });
  });

}

