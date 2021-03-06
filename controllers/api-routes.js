var db = require("../models");
// TODO: move from request to axios
var request = require("request");
var cheerio = require("cheerio");

// Routes
// =============================================================
module.exports = function(app) {

  app.get('/', function (req, res) {
    res.render('home');
  });

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
    
  // Route for getting articles and sending to handlebars
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .populate("note")
      .then(function(dbArticle) {
        res.render("home", {articles: dbArticle});
      })
      .catch(function(err) {
        res.json(500).send('Server failure');
      });
  });

  // Route for populating article with a note
  app.get("/articles/:id", function(req, res) {
    console.log(`got request for ${req.params.id}`);
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        console.log(dbArticle);
        res.render("home", {note: dbArticle});
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

  // Route for deleting note from article
  app.get("/notes/delete/:id", function(req, res) {
    console.log(`got request to delete ${req.params.id}`);
    db.Note.findOneAndRemove({ _id: req.params.id })
      .then(function(dbNote) {
        console.log(dbNote);
        res.status(200).send('note deleted');
      })
      .catch(function(err) {
        res.status(500).send('Server failure');
      });
  });

}

