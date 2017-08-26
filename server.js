

// Dependencies
var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

// require models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");


mongoose.Promise = Promise;


// initialize express
var app = express();

// use morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(methodOverride("_method"));

app.use(express.static("public"));

// configure with mongoose
mongoose.connect("mongodb://localhost/hw14");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// scrape the echojs website
app.get("/scrape", function(req, res) {
  
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

app.get("/articles", function(req, res) {

  Article.find({}, function(err, doc){
    if(err) throw err;
    else{
      res.send(doc)
    }
  })

});

app.get("/saved", function(req, res) {

  Article.find({"saved":true}, function(err, doc){
    if(err) throw err;
    else{
      res.send(doc)
    }
  })

});

app.get("/articles/:id", function(req, res) {

  Article.findOne(
    {"_id":req.params.id}
  )
  .populate("note")
  .exec(function(err, doc){
    if(err) throw err
    else{
      res.send(doc)
    }
  })

});

app.post("/articles/:id", function(req, res) {

  var newNote = new Note(req.body);
  newNote.save(function(err, doc){
    if(err) throw err;
    else{
      Article.findOneAndUpdate({"_id":req.params.id}, {$set: {'note': doc._id}}, {new:true}, 
      function(err, doc){   
        if(err) throw err;
        else{res.send(doc)}
      })
    }

  })


});

app.put('/save/:id', function(req, res, next) {
  console.log(req.body.saved)
  Article.findOneAndUpdate({ "_id": req.params.id }, { $set: { 'saved': req.body.saved } }, { new: true },
    function (err, doc) {
      if (err) throw err;
      else { res.send(doc) }
    })


});

app.delete('/remove/:id', function(req, res, next) {
  Note.findById(req.params.id, function (err, doc) {
    if(err) { return next(err); }
    doc.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
});

// Listen on port 3000
app.listen(8080, function() {
  console.log("App running on port 8080!");
});
