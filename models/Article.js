var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  // `link` is unique and prevents storing duplicate articles
  link: {
    type: String,
    unique: true,
    required: true
  },
  // article may not have a summary
  summary: {
    type: String,
    required: false
  },
  // `note` stores the object id of a Note

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
