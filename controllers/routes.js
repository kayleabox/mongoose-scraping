var express = require("express");

var router = express.Router();

var cheerio = require("cheerio");

var request = require("request");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");


//var db = require("../models");

// scrape the echojs website
router.get("/scrape", function(req, res) {
  
  // get body of the html with request
  request("http://www.cnn.com/world/", function(error, response, html) {
    console.log(html);
    // load html into cheerio and save
    var $ = cheerio.load(html);

    $("article h3").each(function(i, element) {
  
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.saved = false;
      
      if(result.link && result.title){
        Article.findOne({title: result.title}, function (err, found) {
          if (err) throw err;
          if(found){
            console.log("article already logged");
          }
          else {
             var entry = new Article(result);
             entry.save(function (err, doc) {
               if (err) throw (err);
               else {
                 console.log(doc);  
               }
             });
          }
        })
      }

    });
  });

  res.send("Scrape Complete");
});

router.get("/", function(req, res) {

  Article.find({}, function(err, articles){
    if(err) throw err;
    else{
      var hbs = {article: articles}
      res.render("index", hbs)
    }
  })

});

router.get("/articles", function(req, res) {

  Article.find({})
  .populate("note")
  .exec( function(err, articles){
    if(err) throw err;
    else{
      var hbs = {article: articles}
      res.render("index", hbs)
    }
  })

});

router.get("/saved", function(req, res) {

  Article.find({"saved":true}, function(err, articles){
    if(err) throw err;
    else{
      console.log(articles)
      var hbs = {article: articles}
      res.render("index", hbs)
    }
  })

});

router.get("/articles/:id", function(req, res) {

  Article.findOne(
    {"_id":req.params.id}
  )
  .populate("note")
  .exec(function(err, articles){
    if(err) throw err
    else{
      var hbs = {article: articles};
      res.send(articles)
    }
  })

});

router.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);
  newNote.save(function(err, doc){
    if(err) throw err;
    else{
      Article.findOneAndUpdate({"_id":req.params.id}, {$set: {'note': doc._id}}, {new:true}, 
      function(err, doc){   
        if(err) throw err;
        else{res.redirect("/articles")}
      })
    }

  })


});

router.put('/save/:id', function(req, res, next) {
  console.log(req.body.saved)
  Article.findOneAndUpdate({ "_id": req.params.id }, { $set: { 'saved': req.body.saved } }, { new: true },
    function (err, doc) {
      if (err) throw err;
      else { res.redirect("/articles") }
    })


});

router.post('/remove/:id', function(req, res, next) {
  Note.findById(req.params.id, function (err, doc) {
    if(err) { return next(err); }
    doc.remove(function(err) {
      if(err) { return handleError(res, err); }
      res.redirect("/articles");
    });
  });
});

module.exports = router;