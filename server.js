

// Dependencies
var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var hb = require("express-handlebars");

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
app.engine("handlebars", hb({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var routes = require("./controllers/routes.js")
app.use("/", routes);


// configure with mongoose
mongoose.connect("mongodb://heroku_v2bd8wm8:6cio4u2cgakbm9gehu0ddng0sa@ds159493.mlab.com:59493/heroku_v2bd8wm8")
//mongoose.connect("mongodb://localhost/hw14");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.listen(process.env.PORT || 8080, function() {
  console.log("App running!");
});
